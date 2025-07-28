import MarginWithWrapper from "./MarginWithWrapper";
import PageWrapper from "./PageWrapper";
import SidebarKasir from "./SidebarKasir";

const KasirLayout = ({ children, kasir }) => {
    return (
        <html lang="en">
            <body className="bg-white">
                <div className="flex">
                    <SidebarKasir kasir={kasir} />
                    <main className="flex-1">
                        <MarginWithWrapper>
                            <PageWrapper>{children}</PageWrapper>
                        </MarginWithWrapper>
                    </main>
                </div>
            </body>
        </html>
    );
};

export default KasirLayout;