let rsa = forge.pki;
let keypair;
let aesKey;

function generateKeys() {
    alert("Generating 2048-bit RSA keys, please wait...");
    setTimeout(() => {
        keypair = rsa.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
        document.getElementById("publicKey").value = rsa.publicKeyToPem(keypair.publicKey);
        document.getElementById("privateKey").value = rsa.privateKeyToPem(keypair.privateKey);
        alert("RSA keys generated!");
    }, 100);
}

function encryptMessage() {
    const message = document.getElementById("message").value;
    if (!message || !keypair?.publicKey) {
        alert("Please enter a message and generate keys first.");
        return;
    }

    aesKey = CryptoJS.lib.WordArray.random(16).toString(); // 128-bit AES key
    const encryptedMessage = CryptoJS.AES.encrypt(message, aesKey).toString();
    const encryptedAesKey = keypair.publicKey.encrypt(aesKey, "RSA-OAEP");

    const result = {
        encryptedKey: forge.util.encode64(encryptedAesKey),
        encryptedMessage: encryptedMessage
    };

    document.getElementById("encryptedData").value = JSON.stringify(result, null, 2);
}

function decryptMessage() {
    const privateKeyPem = document.getElementById("privateKey").value;
    const encryptedDataText = document.getElementById("encryptedData").value;

    if (!privateKeyPem || !encryptedDataText) {
        alert("Please provide the private key and encrypted data.");
        return;
    }

    const privateKey = rsa.privateKeyFromPem(privateKeyPem);
    const encryptedData = JSON.parse(encryptedDataText);

    const decryptedAesKey = privateKey.decrypt(
        forge.util.decode64(encryptedData.encryptedKey),
        "RSA-OAEP"
    );

    const decryptedMessage = CryptoJS.AES.decrypt(
        encryptedData.encryptedMessage, decryptedAesKey
    ).toString(CryptoJS.enc.Utf8);

    document.getElementById("decryptedMessage").value = decryptedMessage;
}
