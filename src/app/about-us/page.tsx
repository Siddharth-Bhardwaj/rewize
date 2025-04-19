import PageContainer from "@/components/PageContainer"
import React from "react"

const AboutPage = () => {
    return (
        <PageContainer>
            <div className="flex flex-col items-center h-screen px-4 py-8 text-center">
            <p className="text-lg max-w-xl mb-10">
                Hey there! 👋 We're a squad of code-breathing warriors from NYU Tandon School of Engineering, forging our path through a Master’s in Computer Science. This hackathon is our Final Selection — a test of skill and willpower. We're here to slash through bugs, stay calm, and maybe even go full Hinokami Kagura on our code. Let's make this first hackathon legendary! ⚔️💻🔥
            </p>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-3xl">
                    <article className="bg-neutral-800 shadow-lg rounded-2xl p-4 flex flex-col items-center transition-transform duration-300 transform hover:scale-105 hover:shadow-xl">
                        <h2 className="font-semibold text-xl">Aryaman Rishabh</h2>
                        <a href="https://github.com/aryamanrishabh" className="text-cream-600 hover:underline mt-2">Github</a>
                    </article>

                    <article className="bg-neutral-800 shadow-lg rounded-2xl p-4 flex flex-col items-center transition-transform duration-300 transform hover:scale-105 hover:shadow-xl">
                        <h2 className="font-semibold text-xl">Siddharth Bhardwaj</h2>
                        <a href="https://github.com/Siddharth-Bhardwaj" className="text-cream-600 hover:underline mt-2">Github</a>
                    </article>

                    <article className="bg-neutral-800 shadow-lg rounded-2xl p-4 flex flex-col items-center transition-transform duration-300 transform hover:scale-105 hover:shadow-xl">
                        <h2 className="font-semibold text-xl">Laba Kumar Deka</h2>
                        <a href="https://github.com/Kuxha" className="text-cream-600 hover:underline mt-2">Github</a>
                    </article>

                    <article className="bg-neutral-800 shadow-lg rounded-2xl p-4 flex flex-col items-center transition-transform duration-300 transform hover:scale-105 hover:shadow-xl">
                        <h2 className="font-semibold text-xl">Rashmika Ranjan</h2>
                        <a href="https://github.com/rashmikaranjan" className="text-cream-600 hover:underline mt-2">Github</a>
                    </article>
                </div>
            </div>
        </PageContainer>
    )
}

export default AboutPage