import bwipjs from "bwip-js";

export default async function generateBarcode(id: string): Promise<Buffer> {
    try {
        if (!id) throw new Error("ID is required");
        const options = { bcid: "qrcode", text: id, scale: 3};
        const pngBuffer = await bwipjs.toBuffer(options);
        return pngBuffer;
    } catch (error) {
        throw new Error("Error generating barcode: " + error);
    }
}