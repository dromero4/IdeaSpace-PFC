export function Options({ svg, text }) {
    return (
        <div className="flex flex-row items-center gap-10 w-full h-20 hover:shadow-md cursor-pointer">
            <img src={svg} alt="article image" className="w-10 h-10 ml-5" />
            <p className="">{text}</p>
        </div>
    )
}