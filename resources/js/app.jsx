import "./bootstrap";
import { createInertiaApp } from "@inertiajs/inertia-react";
import React from "react";
import { render } from "react-dom";
import "../css/app.css";

createInertiaApp({
    resolve: (name) => import(`./Pages/${name}`),
    setup({ el, App, props }) {
        render(<App {...props} />, el);
    },
});