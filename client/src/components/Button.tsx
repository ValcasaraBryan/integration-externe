type ButtonProps = {
    onClick: () => void,
    buttonContent: string,
    id?:string,
    disabled?:boolean,
    className?:string
}

const Button = ({id, onClick, buttonContent, disabled, className}: ButtonProps) => {
    return <button
        id={id}
        className={`${className} mt-6 block select-none rounded-lg bg-pink-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
        type="button"
        data-ripple-light="true"
        onClick={onClick}
        disabled={disabled}
    >
        {buttonContent}
    </button>
}

export default Button;