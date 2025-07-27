import "./bootstrap";
import { createInertiaApp } from "@inertiajs/inertia-react";
import React from "react";
import { render } from "react-dom";
import "../css/app.css";

const pages = import.meta.glob("./Pages/**/*.jsx");

createInertiaApp({
    resolve: (name) => {
        const page = pages[`./Pages/${name}.jsx`];
        if (!page) throw new Error(`Page not found: ./Pages/${name}.jsx`);
        return page();
    },
    setup({ el, App, props }) {
        render(<App {...props} />, el);
    },
});
