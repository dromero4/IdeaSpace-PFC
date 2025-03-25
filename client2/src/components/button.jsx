export function Button({ text, svg }) {
    return (
        <button className="w-24 h-10 bg-[#474747] text-[#d9d9d9] rounded cursor-pointer m-2">{svg && <img src={svg} />}{text}</button>
    )
}