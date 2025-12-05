const https = require('https');
const url = "https://res.cloudinary.com/dr0lrme36/image/upload/f_auto,q_auto,w_1600,c_limit/v1764844292/Omni_post_Ai_autoamtion/omni_post_ai_assets/Asset_6_Session-Based_File_Structure.png";

console.log('Checking URL:', url);
https.get(url, (res) => {
    console.log('StatusCode:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);
    console.log('Content-Length:', res.headers['content-length']);
}).on('error', (e) => {
    console.error('Error:', e);
});
