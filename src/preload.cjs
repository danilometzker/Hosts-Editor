// Veja a documentação do Electron para detalhes sobre como usar scripts de preload:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer, shell } = require("electron");
const fs = require("fs");
const path = require("path");
const sudo = require("sudo-prompt");
const os = require("os");

contextBridge.exposeInMainWorld("electron", {
    invoke: (channel, args) => ipcRenderer.invoke(channel, args),
    send: (channel, args) => ipcRenderer.send(channel, args),
    on: (channel, callback) =>
        ipcRenderer.on(channel, (event, ...data) => callback(...data)),
    shell,
    readFile: (filePath) => fs.readFileSync(filePath, "utf-8"),
    writeFile: (filePath, data) => {
        return new Promise((resolve, reject) => {
            const tempDir = os.tmpdir();
            const tempFilePath = path.join(tempDir, "hostsedit.tmp");

            try {
                fs.writeFileSync(tempFilePath, data, "utf8");
            } catch (error) {
                return reject({
                    success: false,
                    message:
                        "Erro ao escrever o arquivo temporário: " +
                        error.message,
                });
            }

            const cmd = `move /Y "${tempFilePath}" "${filePath}"`;
            sudo.exec(cmd, { name: "hostsedit" }, (error) => {
                if (error) {
                    return reject({
                        success: false,
                        message:
                            error.message ||
                            "Erro ao mover o arquivo temporário.",
                    });
                } else {
                    return resolve({
                        success: true,
                        message: "Arquivo atualizado com sucesso.",
                    });
                }
            });
        });
    },
});

window.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // Impede o menu de contexto do navegador
});

console.log("Preload script loaded!");
