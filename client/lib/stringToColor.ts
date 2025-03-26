export function stringToColor (str:string){
    let hash = 0;
    for(const char of str){
        hash += char.charCodeAt(0);
    }
    const color = (hash % 0xFFFFFF).toString(16).padStart(6, '0');
    return `#${color}`;
}