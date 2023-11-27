import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
    return (
        <div className="flex h-screen w-full flex-col">
            <div className="relative isolate flex h-screen w-full flex-col overflow-hidden">
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>
                <Header />
                {/* <Spacer y={2} /> */}
                <div className="flex flex-1 overflow-hidden">
                    <aside className={`hidden flex-col justify-between overflow-y-auto px-4 py-2 shadow-xl lg:flex`}>
                        <Sidebar />
                        <Footer />
                    </aside>
                    <main className={`flex flex-1 overflow-y-auto px-10 md:px-12`}>
                        <div className="w-full">{children}</div>
                    </main>
                </div>

                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    aria-hidden="true"
                >
                    <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
                </div>
            </div>
        </div>
    );
}
