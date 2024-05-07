import React from 'react'
import { ModeToggle } from '../buttons/DarkMode'

function Header() {
    return (
        <div className="w-full p-2 flex justify-center">
            <ModeToggle />
        </div>
    )
}

export default Header