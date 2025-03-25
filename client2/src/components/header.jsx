

export function Header({ svg, text }) {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-4xl m-4">{text}{svg && "!"}</h1>
                {svg && <img src={svg} alt="Image waving you" />}
            </div>

            <hr className="mx-4" />
        </>
    )
}