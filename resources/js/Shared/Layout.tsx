import { Link, usePage } from '@inertiajs/react'
import { ReactNode } from 'react'
import Dropdown from '@/Shared/Dropdown'
import FlashMessages from '@/Shared/FlashMessages'
import Icon from '@/Shared/Icon'
import Logo from '@/Shared/Logo'
import MainMenu from '@/Shared/MainMenu'
import { SharedPageProps } from '@/types'

export default function Layout({ children }: { children: ReactNode }) {
    const { auth } = usePage<SharedPageProps>().props
    const user = auth.user!

    return (
        <div>
            <div id="dropdown" />
            <div className="md:flex md:flex-col">
                <div className="md:flex md:h-screen md:flex-col">
                    <div className="md:flex md:shrink-0">
                        <div className="flex items-center justify-between bg-indigo-900 px-6 py-4 md:w-56 md:shrink-0 md:justify-center">
                            <Link className="mt-1" href="/ivr">
                                <Logo className="fill-white" width={120} height={28} />
                            </Link>
                            <Dropdown
                                className="md:hidden"
                                placement="bottom-end"
                                dropdown={
                                    <div className="mt-2 rounded bg-indigo-800 px-8 py-4 shadow-lg">
                                        <MainMenu />
                                    </div>
                                }
                            >
                                <svg className="h-6 w-6 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                                </svg>
                            </Dropdown>
                        </div>
                        <div className="md:text-md flex w-full items-center justify-between border-b bg-white p-4 text-sm md:px-12 md:py-0">
                            <div className="mr-4 mt-1">{user.account.name}</div>
                            <Dropdown
                                className="mt-1"
                                placement="bottom-end"
                                dropdown={
                                    <div className="mt-2 rounded bg-white py-2 text-sm shadow-xl">
                                        <Link className="block px-6 py-2 hover:bg-indigo-500 hover:text-white" href={`/users/${user.id}/edit`}>
                                            My Profile
                                        </Link>
                                        <Link className="block px-6 py-2 hover:bg-indigo-500 hover:text-white" href="/users">
                                            Manage Users
                                        </Link>
                                        <Link className="block w-full px-6 py-2 text-left hover:bg-indigo-500 hover:text-white" href="/logout" method="delete" as="button">
                                            Logout
                                        </Link>
                                    </div>
                                }
                            >
                                <div className="group flex cursor-pointer select-none items-center">
                                    <div className="mr-1 whitespace-nowrap text-gray-700 group-hover:text-indigo-600 focus:text-indigo-600">
                                        <span>{user.first_name}</span>
                                        <span className="hidden md:inline">&nbsp;{user.last_name}</span>
                                    </div>
                                    <Icon className="h-5 w-5 fill-gray-700 group-hover:fill-indigo-600 focus:fill-indigo-600" name="cheveron-down" />
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="md:flex md:grow md:overflow-hidden">
                        <MainMenu className="hidden w-56 shrink-0 overflow-y-auto bg-indigo-800 p-12 md:block" />
                        <div className="px-4 py-8 md:flex-1 md:overflow-y-auto md:p-12" scroll-region="">
                            <FlashMessages />
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
