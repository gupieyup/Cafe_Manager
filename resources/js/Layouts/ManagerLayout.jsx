import MarginWithWrapper from "./MarginWithWrapper";
import PageWrapper from "./PageWrapper";
import SidebarManager from "./SidebarManager";

const ManagerLayout = ({ children, manager }) => {
    return (
        <html lang="en">
            <body className="bg-white">
                <div className="flex">
                    <SidebarManager manager={manager} />
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
export default ManagerLayout;