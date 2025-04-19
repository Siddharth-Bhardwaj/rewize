import PageContainer from "@/components/PageContainer"
import React from "react"

const HowToUse = () => {
    const businesses = [
        { name: "Amazon" },
        { name: "SkyScanner" },
        { name: "ClassPass" }
    ]

    return (
        <PageContainer>
            <div className="flex flex-col items-center min-h-screen px-4 py-10 text-center">
                <h1 className="text-4xl font-bold mb-6 text-white">How to Use</h1>

                {/* Styled Steps */}
                <ul className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-black text-base font-medium">
                    <li className="flex items-center justify-center bg-white rounded-full px-4 py-2 shadow">
                        <span className="mr-2 font-bold text-black">1.</span> Plug In 🔌
                    </li>
                    <li className="flex items-center justify-center bg-white rounded-full px-4 py-2 shadow">
                        <span className="mr-2 font-bold text-black">2.</span> Chill 😎
                    </li>
                    <li className="flex items-center justify-center bg-white rounded-full px-4 py-2 shadow">
                        <span className="mr-2 font-bold text-black">3.</span> Save 💰
                    </li>
                </ul>

                {/* Magic Message */}
                <p className="text-white text-16px italic mb-10">let our tool do its magic ✨</p>

                {/* Business Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
                    {businesses.map((biz, idx) => (
                        <div
                            key={idx}
                            className="bg-neutral-800 text-white p-6 rounded-2xl shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center justify-between"
                        >
                            <h2 className="text-xl font-semibold mb-2">{biz.name}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </PageContainer>
    )
}

export default HowToUse
