import React, { ReactElement } from 'react'
import Link from 'next/Link'
interface Props {
    
}

function Footer({}: Props): ReactElement {
    return (
        <div>
            <Link href="/about/">
                <a data-cy="nav-item">About</a>
            </Link>

            <button
                onClick={() => (console.log('Hello'))}
                data-cy="mmenu-btn"
            >
            Menu
            </button>
        </div>
    )
}

export default Footer
