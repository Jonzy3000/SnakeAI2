import Brain from "./brain";

export default class BrainWriter {
    public static write(results: Brain.Result[], generationNumber: number) {
        let json: string = JSON.stringify(results);
        let fileName = "SnakeBrain_Generation_" + generationNumber + ".json";
        this.download(json, fileName, "application/json")

    }

    private static download(strData: string, strFileName: string, strMimeType: string) {
        var D = document,
            A = arguments,
            a = D.createElement("a"),
            d = A[0],
            n = A[1],
            t = A[2] || "text/plain";

        //build download link:
        a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);



        if ('download' in a) { //FF20, CH19
            a.setAttribute("download", n);
            a.innerHTML = "downloading...";
            D.body.appendChild(a);
            setTimeout(function () {
                var e = D.createEvent("MouseEvents");
                e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
                D.body.removeChild(a);
            }, 66);
            return true;
        };
    }
}