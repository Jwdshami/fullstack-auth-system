export default async function UserProfilePage({ params }: any) {
    const resolvedParams = await params;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            

            <p className="text-gray-600 mb-4">
                This is the user profile page for user:
                <span className="font-bold text-black bg-gray-200 p-2 rounded-md">
                    {resolvedParams.id}
                </span>
            </p>

            <hr />
        </div>
    );
}