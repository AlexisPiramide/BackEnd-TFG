import bwipjs from "bwip-js";

export default async function generateBarcode(id: string): Promise<File> {
    try {
        if(!id) throw new Error("ID is required");
        const options = {bcid: "code128", text: id, scale: 3, height: 10, includetext: false};
        const pngBuffer = await bwipjs.toBuffer(options);
        return pngBuffer;
    } catch (error) {
        throw new Error("Error generating barcode: " + error);
    }
}
