import fs from "fs";
import path from "path";






class FontExtractor {
    static isProgramInstalled(): boolean {


        return fs.existsSync(path.resolve(__dirname, "../", "lib/", "pdfcpu.exe"));
    }

}

export { FontExtractor };