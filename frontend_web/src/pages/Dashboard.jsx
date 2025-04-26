import MainLayout from "@/components/main-layout";

export default function Dashboard() {
    return (
        <MainLayout>
            <div className="flex flex-col items-start justify-center py-4">
                <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Track your project metrics and performance</p>
            </div>
        </MainLayout>
        
    );
}