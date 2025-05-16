export function Button({ text, svg, width = 24 }) {
    return (
        <button className={`w-${width} h-10 bg-[#474747] text-[#d9d9d9] rounded cursor-pointer m-2 p-2`}>
            {svg && <img src={svg} />}{text}</button>
    )
}