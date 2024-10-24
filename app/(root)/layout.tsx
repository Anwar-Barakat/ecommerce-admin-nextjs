interface SetupLayoutProps {
    children: React.ReactNode;
}

const SetupLayout = ({ children }: SetupLayoutProps

) => {
    return (<div className="flex items-center justify-center h-full">
        {children}
    </div>);
}

export default SetupLayout;