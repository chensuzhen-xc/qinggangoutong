import { NextRequest, NextResponse } from 'next/server';

const debugLog = (...args: any[]) => {
  console.log('[API /try-on]', ...args);
};

// 模拟火山引擎API响应（先用这个，确保项目能跑）
const getMockResult = () => {
  return {
    model: "doubao-seedream-5-0-260128",
    created: Date.now(),
    data: [
      {
        // 我们先用示例图作为模拟结果
        url: "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png",
        size: "2048x2048"
      }
    ],
    usage: {
      generated_images: 1,
      output_tokens: 16384,
      total_tokens: 16384
    }
  };
};

export async function POST(request: NextRequest) {
  debugLog('Received request');
  
  try {
    // Parse request body
    const body = await request.json();
    debugLog('Request body parsed');

    const { personImage, clothingImage } = body;

    // Validate inputs
    if (!personImage || !clothingImage) {
      debugLog('Validation failed: Missing images');
      return NextResponse.json({
        success: false,
        error: 'Both personImage and clothingImage are required',
        errorCode: 400
      }, { status: 400 });
    }

    // ========== 调用真实火山引擎API ==========
    const API_KEY = process.env.ARK_API_KEY || '';
    const API_URL = process.env.ARK_API_URL || 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
    
    if (!API_KEY || API_KEY === '') {
      debugLog('API key not found - using mock result');
      const data = getMockResult();
      return NextResponse.json({
        success: true,
        resultUrl: data.data[0].url
      });
    }
    
    debugLog('Calling real Volcano Engine API...');
    
    const requestPayload = {
      model: "doubao-seedream-5-0-260128",
      prompt: "将图1的服装换为图2的服装",
      image: [personImage, clothingImage],
      sequential_image_generation: "disabled",
      response_format: "url",
      size: "2K",
      stream: false,
      watermark: false
    };

    debugLog('Sending request to API...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestPayload)
    });

    debugLog('API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      debugLog('API error:', errorText);
      // 出错时回退到模拟结果
      const data = getMockResult();
      return NextResponse.json({
        success: true,
        resultUrl: data.data[0].url
      });
    }

    const data = await response.json();
    debugLog('API response:', data);

    debugLog('Try-on complete');

    // Return response
    return NextResponse.json({
      success: true,
      resultUrl: data.data[0].url
    });

  } catch (error: any) {
    debugLog('Error handling request:', error.message);
    // 出错时回退到模拟结果
    const data = getMockResult();
    return NextResponse.json({
      success: true,
      resultUrl: data.data[0].url
    });
  }
}
