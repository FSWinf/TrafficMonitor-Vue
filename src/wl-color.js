export default function (str) {
    if (/^\d*$/.test(str)) {
        return {
            backgroundColor: "rgb(226,0,26)",
            color: "#fff"
        }
    } else {
        return "#ccc";
    }
}