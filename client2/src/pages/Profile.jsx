import { Header } from '../components/header'

export function Profile({ user = '[user]' }) {
    return (
        <Header text={`Howdy, ${user}`} svg={"./img/wave.svg"} />
    )
}