const axios = require('axios');  
const fs = require('fs');  
const https = require('https');  

async function generateApiSpecification() {  
    try {  
        const agent = new https.Agent({ rejectUnauthorized: false });  
        // 请求 OpenAPI 文档的端点  
        const response = await axios.get('https://192.168.122.129:30080/api/docs', { httpsAgent: agent });  
        const apiSpecification = response.data;  

        // 写入 JSON 文件  
        fs.writeFileSync('oneapi.json', JSON.stringify(apiSpecification, null, 2));  
        console.log('oneapi.json has been generated!');  
    } catch (error) {  
        console.error('Error generating oneapi.json:', error.message);  
    }  
}  

generateApiSpecification();