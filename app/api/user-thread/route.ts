import { prismadb } from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
    const user = await currentUser();

    if (!user) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userThread = await prismadb.userThread.findUnique({
        where: {
            userId: user.id,
        },
    });


    if (userThread) {
        return NextResponse.json({ userThread, success: true}, { status: 200 });
    }

    try {
        const openai = new OpenAI();
    const thread =  await openai.beta.threads.create();

    const newUserThread = await prismadb.userThread.create({
        data: {
            userId: user.id,
            threadId: thread.id,
        },
    });

    return NextResponse.json({ userThread: newUserThread, success: true}, { status: 200 });
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Error creating thread" }, { status: 500 });
    }

    
}