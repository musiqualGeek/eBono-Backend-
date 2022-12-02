const express = require('express')
const router = express.Router();
const nodeRSA = require('node-rsa');
const fetch = require('node-fetch');



router.get("/products/:category", async (req, res) => {
    try{
        const keyData = {
            consumerId: "b3fcef0c-755b-4789-94b4-4b70369bf3d7",
            privateKey: `-----BEGIN RSA PRIVATE KEY-----
        MIICXQIBAAKBgQC3zUWBzqlW1QIWGCBbBODcj0pJ29d20YC6OG8/+dnwldylclh0
        Dw1ym4OpR5IwVE1xprwaPhn7iCyGimHC5Ly0sTZNElhwavin7+ZpkBfKCVZTFTFc
        0ZoQdmh9epYbbKgiHogTizDzKl2Hf7/MkcYOLE/bazxYrt9GlfmMkKA+gQIDAQAB
        AoGAZT/42CcF9cVlXtJvkHRBgn6Ux9cI/HUwWmUYM7/pJLUJVUKGI3jfSZENmETK
        7UCjYMYevL4VBhDfpkW40Om8YUZkrwgMEhTBb4o/ru7HnDDD4JngK/SBfyP4no5N
        qTx2xKP0RVdrdMzoGdaXvqswP8ayzFUDhFXG33JxwGUuugECQQDejrLdUw1FSLGq
        gQLXU1P5Mrmb7UlQL8S3Z1MXeFhjWJ517CyuXckYObc4FvoVnNvfqaRn4BX3xIA9
        7GBy8c1RAkEA02u62VcsmOQ4gOGOf8QV5/mcaT+5N8WS8Zf1n5ni5wv4ues2d/Tf
        nNHWDA4oenA6PBD/k62K4OP3ebJqXlRSMQJBAKlcTiC+osqmlwz5QAA8GRr5zuUp
        nTC4KSqoJkMmAZ0YQv3Zy+ak1/LneNXmJklsJKX/omypyg3SKwT0bDEMcQECQQDA
        hRMqoqUrvHZvdfWrBsXj7XqupKZm0PUUJoo2gY0LU+10b2m0JjoRtUqyw5m8lMGS
        vO/ebGNQkoZiPUN7DlGhAkAy9+SoPN+rCcYDRmmom7ACyG1b3MugNQ6MDoR0Qv8W
        0/MEpwPvZSPEPoRzaj4SdBr3YgdffGzChwveG6JwKIP5
        -----END RSA PRIVATE KEY-----`,
          keyVer: 1,
          impactId: "YOUR IMPACT AFFILIATE ID" // not required
        }
        
        const generateWalmartHeaders = () => {
            const hashList = {
                "WM_CONSUMER.ID": keyData.consumerId,
                "WM_CONSUMER.INTIMESTAMP": Date.now().toString(),
                "WM_SEC.KEY_VERSION": keyData.keyVer,
            };
        
            const sortedHashString = `${hashList["WM_CONSUMER.ID"]}\n${hashList["WM_CONSUMER.INTIMESTAMP"]}\n${hashList["WM_SEC.KEY_VERSION"]}\n`;
            const signer = new nodeRSA(keyData.privateKey, "pkcs1");
            const signature = signer.sign(sortedHashString);
            const signature_enc = signature.toString("base64");
        
            return {
                "WM_SEC.AUTH_SIGNATURE": signature_enc,
                "WM_CONSUMER.INTIMESTAMP": hashList["WM_CONSUMER.INTIMESTAMP"],
                "WM_CONSUMER.ID": hashList["WM_CONSUMER.ID"],
                "WM_SEC.KEY_VERSION": hashList["WM_SEC.KEY_VERSION"],
            };
        }
        
        (async () => {
            const options = {
                method: 'GET',
                headers: generateWalmartHeaders()
            }
            const response = await fetch(`https://developer.api.walmart.com/api-proxy/service/affil/product/v2/paginated/items?query=${req.params.category}&count=40`, options);
            const body = await response.text();
            
            return res.json(JSON.parse(body))
        })();
    }catch(err){
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

module.exports = router