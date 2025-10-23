module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/components/Navbar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const Navbar = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-purple-700 w-full h-12",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: "text-2xl font-sans-serif text-center text-white m-1",
            children: "Magic Story Book"
        }, void 0, false, {
            fileName: "[project]/components/Navbar.tsx",
            lineNumber: 6,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/Navbar.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Navbar;
}),
"[project]/data/story.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"title\":\"The Brave Fox\",\"text\":\"The brave fox went into the forest.\",\"illustrations\":[{\"action\":\"paint_background\",\"background\":\"forest\",\"color\":\"lightgreen\"},{\"action\":\"paint_character\",\"character\":\"fox\",\"x\":200,\"y\":200,\"color\":\"orange\"}]}"));}),
"[project]/components/StoryPage.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$story$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/data/story.json (json)");
"use client";
;
;
;
const StoryPage = ()=>{
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const story = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$story$2e$json__$28$json$29$__["default"];
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw elements from JSON
        story.illustrations.forEach((item)=>{
            if (item.action === "paint_background") {
                // 🌳 Draw sky
                ctx.fillStyle = "#9be7ff"; // light blue
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // 🌿 Draw ground
                ctx.fillStyle = "lightgreen";
                ctx.fillRect(0, canvas.height - 150, canvas.width, 150);
                // 🌲 Draw multiple trees
                for(let i = 0; i < 5; i++){
                    const treeX = 100 + i * 150;
                    const treeY = canvas.height - 150;
                    // tree trunk
                    ctx.fillStyle = "#8B4513"; // brown
                    ctx.fillRect(treeX, treeY - 60, 20, 60);
                    // leaves (triangle)
                    ctx.fillStyle = "green";
                    ctx.beginPath();
                    ctx.moveTo(treeX - 30, treeY - 60);
                    ctx.lineTo(treeX + 10, treeY - 140);
                    ctx.lineTo(treeX + 50, treeY - 60);
                    ctx.closePath();
                    ctx.fill();
                }
                // 🐦 Draw some birds (simple "V" shapes)
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
                for(let i = 0; i < 4; i++){
                    const birdX = 80 + i * 200;
                    const birdY = 80 + Math.random() * 40;
                    ctx.beginPath();
                    ctx.moveTo(birdX, birdY);
                    ctx.lineTo(birdX + 10, birdY - 10);
                    ctx.lineTo(birdX + 20, birdY);
                    ctx.stroke();
                }
            }
            if (item.action === "paint_character" && item.character === "fox") {
                const x = item.x || 250;
                const groundY = canvas.height - 120;
                const y = groundY;
                // 🦊 Body
                ctx.fillStyle = "#F97316";
                ctx.beginPath();
                ctx.ellipse(x, y - 25, 45, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                // Head origin (top-left of body + small offset)
                const headX = x + 25;
                const headY = y - 25;
                // 🦊 Head
                ctx.fillStyle = "#F97316";
                ctx.beginPath();
                ctx.moveTo(headX, headY); // start at body-neck
                ctx.lineTo(headX + 30, headY - 15); // top
                ctx.quadraticCurveTo(headX + 45, headY, headX + 30, headY + 15); // muzzle curve
                ctx.closePath();
                ctx.fill();
                // 🦊 White muzzle (relative to head)
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.moveTo(headX + 25, headY + 5);
                ctx.quadraticCurveTo(headX + 35, headY - 5, headX + 28, headY + 10);
                ctx.fill();
                // 🦊 Ears (relative to head)
                ctx.fillStyle = "#F97316";
                ctx.beginPath();
                ctx.moveTo(headX + 5, headY - 10);
                ctx.lineTo(headX + 10, headY - 35);
                ctx.lineTo(headX + 15, headY - 10);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(headX + 15, headY - 10);
                ctx.lineTo(headX + 20, headY - 35);
                ctx.lineTo(headX + 25, headY - 10);
                ctx.closePath();
                ctx.fill();
                // 🦊 Eyes (relative to head)
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(headX + 18, headY - 5, 2, 0, Math.PI * 2);
                ctx.fill();
                // 🦊 Nose (relative to head)
                ctx.beginPath();
                ctx.arc(headX + 30, headY + 8, 3, 0, Math.PI * 2);
                ctx.fill();
                // 🦊 Tail (curvy, bushy, white tip)
                ctx.fillStyle = "#F97316";
                ctx.beginPath();
                ctx.moveTo(x - 35, y - 20);
                ctx.quadraticCurveTo(x - 80, y - 80, x - 60, y - 15);
                ctx.lineTo(x - 55, y - 10);
                ctx.quadraticCurveTo(x - 85, y - 60, x - 50, y - 25);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.moveTo(x - 60, y - 25);
                ctx.quadraticCurveTo(x - 55, y - 30, x - 50, y - 20);
                ctx.fill();
                // 🐾 Legs (thin and slightly bent)
                ctx.fillStyle = "black";
                ctx.fillRect(x - 20, y - 5, 4, 15);
                ctx.fillRect(x + 5, y - 5, 4, 15);
            }
        });
        ctx.fillStyle = "black";
        ctx.font = "32px Comic Sans MS";
        ctx.fillText(story.title, 20, 50);
        // Draw text
        ctx.fillStyle = "black";
        ctx.font = "24px Comic Sans MS";
        ctx.fillText(story.text, 20, canvas.height - 40);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
            ref: canvasRef,
            width: 900,
            height: 650,
            className: "border border-gray-700 rounded"
        }, void 0, false, {
            fileName: "[project]/components/StoryPage.tsx",
            lineNumber: 180,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/StoryPage.tsx",
        lineNumber: 179,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = StoryPage;
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Navbar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StoryPage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/StoryPage.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "flex min-h-screen flex-col items-center justify-center bg-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StoryPage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5e8ce77b._.js.map