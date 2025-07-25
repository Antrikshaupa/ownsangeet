var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import { SplitText as SplitText$1 } from "gsap/SplitText.js";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {}), /* @__PURE__ */ jsx("link", {
        rel: "icon",
        href: "/favicon.ico"
      }), /* @__PURE__ */ jsx("link", {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      }), /* @__PURE__ */ jsx("script", {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [{
              "@type": "MusicGroup",
              "@id": "https://ownsangeet.com/#musicgroup",
              name: "Own Sangeet",
              alternateName: "Own Sangeet Music Studio",
              url: "https://ownsangeet.com",
              description: "Professional custom song creation service specializing in wedding anthems, corporate jingles, and personalized music for all occasions.",
              foundingDate: "2020",
              foundingLocation: {
                "@type": "Country",
                name: "India"
              },
              genre: ["Custom Music", "Wedding Songs", "Corporate Jingles", "Devotional Music"],
              sameAs: ["https://wa.me/919098019901", "http://OwnSangeet.com"],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-9098019901",
                contactType: "customer service",
                availableLanguage: ["English", "Hindi", "Punjabi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati"]
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
                addressRegion: "India"
              },
              makesOffer: {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Custom Song Creation",
                  description: "Professional custom song composition and production services"
                }
              }
            }, {
              "@type": "WebSite",
              "@id": "https://ownsangeet.com/#website",
              url: "https://ownsangeet.com",
              name: "Own Sangeet",
              description: "Create custom songs for weddings, corporate events, devotional occasions, and special celebrations with professional quality and fast delivery.",
              publisher: {
                "@id": "https://ownsangeet.com/#musicgroup"
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://ownsangeet.com/?s={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              inLanguage: "en-IN"
            }]
          })
        }
      })]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function ContactForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    serviceRequired: "",
    language: "",
    style: "",
    message: ""
  });
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxlzw7xmBp6vOGObsDWE86Z74nPhzSquafIhkQeuuTt5rGYC0vZu_KmCPFLJnj059clYQ/exec";
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.result === "success") {
        alert("Submission successful!");
        onClose();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { y: -50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 50, opacity: 0 },
          className: "bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Create Your Custom Song" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8", children: "Fill out the form below, and we'll be in touch to discuss how we can turn your story into a unique musical masterpiece." }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "name",
                    placeholder: "Your Name",
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500",
                    value: formData.name,
                    onChange: handleChange
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    name: "email",
                    placeholder: "Your Email",
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500",
                    value: formData.email,
                    onChange: handleChange
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "tel",
                    name: "phone",
                    placeholder: "Your Phone Number",
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500",
                    value: formData.phone,
                    onChange: handleChange
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "eventType",
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500",
                    value: formData.eventType,
                    onChange: handleChange,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select Event Type" }),
                      /* @__PURE__ */ jsx("option", { value: "Wedding Ceremony", children: "Wedding Ceremony (Haldi, Sangeet, etc.)" }),
                      /* @__PURE__ */ jsx("option", { value: "Corporate Event", children: "Corporate Event" }),
                      /* @__PURE__ */ jsx("option", { value: "Birthday or Anniversary", children: "Birthday or Anniversary" }),
                      /* @__PURE__ */ jsx("option", { value: "Religious or Cultural", children: "Religious or Cultural Event" }),
                      /* @__PURE__ */ jsx("option", { value: "Personal Project", children: "Personal Project" }),
                      /* @__PURE__ */ jsx("option", { value: "Other", children: "Other" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-gray-700 text-sm font-bold mb-2", children: "What Service Do You Require?" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "serviceRequired",
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500",
                    value: formData.serviceRequired,
                    onChange: handleChange,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select a Service" }),
                      /* @__PURE__ */ jsx("option", { value: "Full Song Production", children: "Full Song Production (Lyrics, Music, Vocals)" }),
                      /* @__PURE__ */ jsx("option", { value: "Lyrics Only", children: "Lyrics Only" }),
                      /* @__PURE__ */ jsx("option", { value: "Instrumental Track", children: "Instrumental Track / Score" }),
                      /* @__PURE__ */ jsx("option", { value: "Jingle or Anthem", children: "Jingle or Brand Anthem" }),
                      /* @__PURE__ */ jsx("option", { value: "Karaoke Track", children: "Karaoke Version" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "language",
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500",
                    value: formData.language,
                    onChange: handleChange,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Preferred Language" }),
                      /* @__PURE__ */ jsx("option", { value: "Hindi", children: "Hindi" }),
                      /* @__PURE__ */ jsx("option", { value: "English", children: "English" }),
                      /* @__PURE__ */ jsx("option", { value: "Punjabi", children: "Punjabi" }),
                      /* @__PURE__ */ jsx("option", { value: "Bhojpuri", children: "Bhojpuri" }),
                      /* @__PURE__ */ jsx("option", { value: "Gujarati", children: "Gujarati" }),
                      /* @__PURE__ */ jsx("option", { value: "Marathi", children: "Marathi" }),
                      /* @__PURE__ */ jsx("option", { value: "Other", children: "Other (Specify in message)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    name: "style",
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500",
                    value: formData.style,
                    onChange: handleChange,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Preferred Musical Style" }),
                      /* @__PURE__ */ jsx("option", { value: "Bollywood", children: "Bollywood" }),
                      /* @__PURE__ */ jsx("option", { value: "Devotional/Bhajan", children: "Devotional/Bhajan" }),
                      /* @__PURE__ */ jsx("option", { value: "Folk", children: "Folk" }),
                      /* @__PURE__ */ jsx("option", { value: "EDM", children: "EDM" }),
                      /* @__PURE__ */ jsx("option", { value: "Lo-fi", children: "Lo-fi" }),
                      /* @__PURE__ */ jsx("option", { value: "Orchestral", children: "Orchestral" }),
                      /* @__PURE__ */ jsx("option", { value: "Other", children: "Other (Specify in message)" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  name: "message",
                  placeholder: "Please provide more details about your event, story, or any specific requirements...",
                  rows: 4,
                  className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6",
                  value: formData.message,
                  onChange: handleChange
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-4", children: [
                /* @__PURE__ */ jsx(
                  motion.button,
                  {
                    type: "button",
                    onClick: onClose,
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    className: "bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-semibold transition-all",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  motion.button,
                  {
                    type: "submit",
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    className: "bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all",
                    children: "Submit Enquiry"
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
const MusicPlayer = ({ audioSrc, songName, artistName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };
      const setAudioTime = () => setCurrentTime(audio.currentTime);
      audio.addEventListener("loadeddata", setAudioData);
      audio.addEventListener("timeupdate", setAudioTime);
      if (audio.readyState >= 2) {
        setAudioData();
      }
      audio.play().then(() => setIsPlaying(true)).catch((e) => console.error("Autoplay failed:", e));
      return () => {
        audio.removeEventListener("loadeddata", setAudioData);
        audio.removeEventListener("timeupdate", setAudioTime);
      };
    }
  }, [audioSrc]);
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const handleSeek = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center group/he select-none", children: [
    /* @__PURE__ */ jsx("audio", { ref: audioRef, src: audioSrc, preload: "metadata" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-0 h-16 -mb-2 transition-all duration-200 group-hover/he:h-0", children: [
      /* @__PURE__ */ jsxs(
        "svg",
        {
          width: 128,
          height: 128,
          viewBox: "0 0 128 128",
          className: "duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5 animate-[spin_3s_linear_infinite] transition-all",
          children: [
            /* @__PURE__ */ jsx("rect", { width: 128, height: 128, fill: "black" }),
            /* @__PURE__ */ jsx("circle", { cx: 20, cy: 20, r: 2, fill: "white" }),
            /* @__PURE__ */ jsx("circle", { cx: 40, cy: 30, r: 2, fill: "white" }),
            /* @__PURE__ */ jsx("circle", { cx: 60, cy: 10, r: 2, fill: "white" }),
            /* @__PURE__ */ jsx("circle", { cx: 80, cy: 40, r: 2, fill: "white" }),
            /* @__PURE__ */ jsx("circle", { cx: 100, cy: 20, r: 2, fill: "white" }),
            /* @__PURE__ */ jsx("circle", { cx: 120, cy: 50, r: 2, fill: "white" }),
            /* @__PURE__ */ jsx("circle", { cx: 90, cy: 30, r: 10, fill: "white", fillOpacity: "0.5" }),
            /* @__PURE__ */ jsx("circle", { cx: 90, cy: 30, r: 8, fill: "white" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute z-10 w-8 h-8 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-12 left-12" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "z-30 flex flex-col w-40 h-20 transition-all duration-300 bg-white shadow-md group-hover/he:h-40 group-hover/he:w-72 rounded-2xl shadow-zinc-400", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row w-full h-0 group-hover/he:h-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center w-24 h-24 group-hover/he:-top-6 group-hover/he:-left-4 opacity-0 group-hover/he:opacity-100 transition-all duration-100", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              width: 96,
              height: 96,
              viewBox: "0 0 128 128",
              className: `duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5 ${isPlaying ? "animate-[spin_3s_linear_infinite]" : ""}`,
              children: [
                /* @__PURE__ */ jsx("rect", { width: 128, height: 128, fill: "black" }),
                /* @__PURE__ */ jsx("circle", { cx: 20, cy: 20, r: 2, fill: "white" }),
                /* @__PURE__ */ jsx("circle", { cx: 40, cy: 30, r: 2, fill: "white" }),
                /* @__PURE__ */ jsx("circle", { cx: 60, cy: 10, r: 2, fill: "white" }),
                /* @__PURE__ */ jsx("circle", { cx: 80, cy: 40, r: 2, fill: "white" }),
                /* @__PURE__ */ jsx("circle", { cx: 100, cy: 20, r: 2, fill: "white" }),
                /* @__PURE__ */ jsx("circle", { cx: 120, cy: 50, r: 2, fill: "white" }),
                /* @__PURE__ */ jsx("circle", { cx: 90, cy: 30, r: 10, fill: "white", fillOpacity: "0.5" }),
                /* @__PURE__ */ jsx("circle", { cx: 90, cy: 30, r: 8, fill: "white" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute z-10 w-6 h-6 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-9 left-9" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center w-full pl-3 -ml-24 overflow-hidden group-hover/he:-ml-3 text-nowrap", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xl font-bold", children: songName }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-600", children: artistName })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row mx-3 mt-3 bg-indigo-100 rounded-md min-h-4 group-hover/he:mt-0", children: [
        /* @__PURE__ */ jsx("span", { className: "hidden pl-3 text-sm text-zinc-600 group-hover/he:inline-block", children: formatTime(currentTime) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "range",
            min: 0,
            max: duration,
            value: currentTime,
            onChange: handleSeek,
            className: "w-24 group-hover/he:w-full flex-grow h-1 mx-2 my-auto bg-gray-300 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "hidden pr-3 text-sm text-zinc-600 group-hover/he:inline-block", children: formatTime(duration) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-center flex-grow mx-3 space-x-5", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-full cursor-pointer", children: /* @__PURE__ */ jsxs(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: 24,
            height: 24,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: "feather feather-skip-back",
            children: [
              /* @__PURE__ */ jsx("polygon", { points: "19 20 9 12 19 4 19 20" }),
              /* @__PURE__ */ jsx("line", { x1: 5, y1: 19, x2: 5, y2: 5 })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-center w-12 h-full cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: isPlaying,
              onChange: togglePlayPause,
              className: "hidden peer/playStatus"
            }
          ),
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: 24,
              height: 24,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: 2,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              className: "feather feather-play peer-checked/playStatus:hidden",
              children: /* @__PURE__ */ jsx("polygon", { points: "5 3 19 12 5 21 5 3" })
            }
          ),
          /* @__PURE__ */ jsxs(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: 24,
              height: 24,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: 2,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              className: "hidden feather feather-pause peer-checked/playStatus:inline-block",
              children: [
                /* @__PURE__ */ jsx("rect", { x: 6, y: 4, width: 4, height: 16 }),
                /* @__PURE__ */ jsx("rect", { x: 14, y: 4, width: 4, height: 16 })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-full cursor-pointer", children: /* @__PURE__ */ jsxs(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: 24,
            height: 24,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: "feather feather-skip-forward",
            children: [
              /* @__PURE__ */ jsx("polygon", { points: "5 4 15 12 5 20 5 4" }),
              /* @__PURE__ */ jsx("line", { x1: 19, y1: 5, x2: 19, y2: 19 })
            ]
          }
        ) })
      ] })
    ] })
  ] });
};
function PhotoAudio({ imageSrc, alt, audioSrc }) {
  const [hovered, setHovered] = useState(false);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative inline-block w-full h-full",
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: imageSrc,
            alt,
            className: "cursor-pointer w-full h-full object-cover rounded-lg"
          }
        ),
        /* @__PURE__ */ jsx(AnimatePresence, { children: hovered && /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 },
            transition: { duration: 0.3 },
            className: "absolute top-0 left-0 w-full h-full flex items-center justify-center p-4 rounded-lg z-10",
            children: /* @__PURE__ */ jsx(
              MusicPlayer,
              {
                audioSrc,
                songName: alt,
                artistName: "Own Sangeet"
              }
            )
          }
        ) })
      ]
    }
  );
}
const generateSEOMeta = ({ location }) => {
  const baseUrl = "https://ownsangeet.com";
  const defaultTitle = "Own Sangeet - Custom Songs for Every Occasion | Wedding Songs, Corporate Jingles, Event Music";
  const defaultDescription = "Professional custom song creation service in India. We craft personalized wedding anthems, corporate jingles, devotional music, and celebration tracks. 4-day delivery, multiple languages, lifetime royalties included.";
  const defaultKeywords = "custom songs, wedding songs, corporate jingles, personalized music, Indian music production, sangeet songs, haldi songs, devotional music, brand anthems, custom lyrics, music studio India, Own Sangeet";
  const defaultImage = `${baseUrl}/photos/104545-7-phere-1.jpeg`;
  return [
    // Basic Meta Tags
    { title: defaultTitle },
    { name: "description", content: defaultDescription },
    { name: "keywords", content: defaultKeywords },
    {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    },
    { name: "author", content: "Own Sangeet Music Studio" },
    { name: "language", content: "English" },
    { name: "revisit-after", content: "7 days" },
    { name: "distribution", content: "global" },
    { name: "rating", content: "general" },
    { name: "geo.region", content: "IN" },
    { name: "geo.country", content: "India" },
    { name: "geo.placename", content: "India" },
    // Open Graph Meta Tags
    { property: "og:title", content: defaultTitle },
    { property: "og:description", content: defaultDescription },
    { property: "og:image", content: defaultImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image:alt",
      content: "Own Sangeet - Custom Music Creation Studio"
    },
    { property: "og:url", content: `${baseUrl}${location.pathname}` },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Own Sangeet" },
    { property: "og:locale", content: "en_IN" },
    // Twitter Card Meta Tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: defaultTitle },
    { name: "twitter:description", content: defaultDescription },
    { name: "twitter:image", content: defaultImage },
    {
      name: "twitter:image:alt",
      content: "Own Sangeet - Custom Music Creation Studio"
    },
    { name: "twitter:site", content: "@ownsangeet" },
    { name: "twitter:creator", content: "@ownsangeet" },
    // Additional Meta Tags
    { name: "theme-color", content: "#8B5CF6" },
    { name: "msapplication-TileColor", content: "#8B5CF6" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    { name: "apple-mobile-web-app-title", content: "Own Sangeet" },
    // Canonical URL
    { rel: "canonical", href: `${baseUrl}${location.pathname}` },
    // JSON-LD Structured Data
    {
      tagName: "script",
      type: "application/ld+json",
      dangerouslySetInnerHTML: {
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "MusicGroup",
              "@id": `${baseUrl}/#musicgroup`,
              name: "Own Sangeet",
              alternateName: "Own Sangeet Music Studio",
              url: baseUrl,
              description: "Professional custom song creation service specializing in wedding anthems, corporate jingles, and personalized music for all occasions.",
              foundingDate: "2020",
              foundingLocation: {
                "@type": "Country",
                name: "India"
              },
              genre: [
                "Custom Music",
                "Wedding Songs",
                "Corporate Jingles",
                "Devotional Music"
              ],
              sameAs: ["https://wa.me/919098019901", "http://OwnSangeet.com"],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-9098019901",
                contactType: "customer service",
                availableLanguage: [
                  "English",
                  "Hindi",
                  "Punjabi",
                  "Bengali",
                  "Tamil",
                  "Telugu",
                  "Marathi",
                  "Gujarati"
                ]
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
                addressRegion: "India"
              },
              makesOffer: {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Custom Song Creation",
                  description: "Professional custom song composition and production services"
                }
              }
            },
            {
              "@type": "Service",
              "@id": `${baseUrl}/#service`,
              name: "Custom Song Creation Services",
              provider: {
                "@id": `${baseUrl}/#musicgroup`
              },
              description: "We create personalized songs for weddings, corporate events, devotional occasions, and special celebrations with professional quality and fast delivery.",
              serviceType: "Music Production",
              offers: [
                {
                  "@type": "Offer",
                  name: "Wedding Song Package",
                  description: "Custom wedding anthems for sangeet, haldi, and mehendi ceremonies",
                  priceRange: "₹15,000 - ₹75,000"
                },
                {
                  "@type": "Offer",
                  name: "Corporate Jingle Package",
                  description: "Professional brand anthems and promotional music",
                  priceRange: "₹15,000 - ₹75,000"
                },
                {
                  "@type": "Offer",
                  name: "Devotional Music Package",
                  description: "Custom bhajans and spiritual songs",
                  priceRange: "₹15,000 - ₹75,000"
                }
              ],
              areaServed: {
                "@type": "Country",
                name: "India"
              }
            },
            {
              "@type": "WebSite",
              "@id": `${baseUrl}/#website`,
              url: baseUrl,
              name: "Own Sangeet",
              description: defaultDescription,
              publisher: {
                "@id": `${baseUrl}/#musicgroup`
              },
              potentialAction: {
                "@type": "SearchAction",
                target: `${baseUrl}/?s={search_term_string}`,
                "query-input": "required name=search_term_string"
              },
              inLanguage: "en-IN"
            },
            {
              "@type": "FAQPage",
              "@id": `${baseUrl}/#faqpage`,
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How long does it take to create a custom song?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our standard turnaround time is 4 calendar days from the initial consultation. We also offer rush services with 48-hour delivery for an additional fee."
                  }
                },
                {
                  "@type": "Question",
                  name: "What languages do you compose in?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We create songs in Hindi, English, Punjabi, Bhojpuri, Gujarati, Marathi, Bengali, Tamil, Telugu, and most Indian regional languages upon request."
                  }
                },
                {
                  "@type": "Question",
                  name: "What are your pricing options?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our packages start from ₹15,000 for basic custom songs and go up to ₹75,000 for premium productions with full orchestration and professional singers."
                  }
                },
                {
                  "@type": "Question",
                  name: "Do you provide royalties?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes! You receive 100% master and publishing rights, plus we jointly register the track so you earn 50% lifetime royalties from streaming platforms."
                  }
                }
              ]
            }
          ]
        })
      }
    }
  ];
};
function pointerPrototype() {
  return {
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 0, g: 0, b: 0 }
  };
}
function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6e3,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0.5, g: 0, b: 0 },
  TRANSPARENT = true
}) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let pointers = [pointerPrototype()];
    let config = {
      SIM_RESOLUTION,
      DYE_RESOLUTION,
      DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION,
      PRESSURE,
      PRESSURE_ITERATIONS,
      CURL,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      SHADING,
      COLOR_UPDATE_SPEED
    };
    const { gl, ext } = getWebGLContext(canvas);
    if (!gl || !ext) return;
    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }
    function getWebGLContext(canvas2) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false
      };
      let gl2 = canvas2.getContext(
        "webgl2",
        params
      );
      if (!gl2) {
        gl2 = canvas2.getContext("webgl", params) || canvas2.getContext(
          "experimental-webgl",
          params
        );
      }
      if (!gl2) {
        throw new Error("Unable to initialize WebGL.");
      }
      const isWebGL2 = "drawBuffers" in gl2;
      let supportLinearFiltering = false;
      let halfFloat = null;
      if (isWebGL2) {
        gl2.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = !!gl2.getExtension(
          "OES_texture_float_linear"
        );
      } else {
        halfFloat = gl2.getExtension("OES_texture_half_float");
        supportLinearFiltering = !!gl2.getExtension(
          "OES_texture_half_float_linear"
        );
      }
      gl2.clearColor(0, 0, 0, 1);
      const halfFloatTexType = isWebGL2 ? gl2.HALF_FLOAT : halfFloat && halfFloat.HALF_FLOAT_OES || 0;
      let formatRGBA;
      let formatRG;
      let formatR;
      if (isWebGL2) {
        formatRGBA = getSupportedFormat(
          gl2,
          gl2.RGBA16F,
          gl2.RGBA,
          halfFloatTexType
        );
        formatRG = getSupportedFormat(
          gl2,
          gl2.RG16F,
          gl2.RG,
          halfFloatTexType
        );
        formatR = getSupportedFormat(
          gl2,
          gl2.R16F,
          gl2.RED,
          halfFloatTexType
        );
      } else {
        formatRGBA = getSupportedFormat(gl2, gl2.RGBA, gl2.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl2, gl2.RGBA, gl2.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl2, gl2.RGBA, gl2.RGBA, halfFloatTexType);
      }
      return {
        gl: gl2,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering
        }
      };
    }
    function getSupportedFormat(gl2, internalFormat, format, type) {
      if (!supportRenderTextureFormat(gl2, internalFormat, format, type)) {
        if ("drawBuffers" in gl2) {
          const gl22 = gl2;
          switch (internalFormat) {
            case gl22.R16F:
              return getSupportedFormat(gl22, gl22.RG16F, gl22.RG, type);
            case gl22.RG16F:
              return getSupportedFormat(gl22, gl22.RGBA16F, gl22.RGBA, type);
            default:
              return null;
          }
        }
        return null;
      }
      return { internalFormat, format };
    }
    function supportRenderTextureFormat(gl2, internalFormat, format, type) {
      const texture = gl2.createTexture();
      if (!texture) return false;
      gl2.bindTexture(gl2.TEXTURE_2D, texture);
      gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MIN_FILTER, gl2.NEAREST);
      gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MAG_FILTER, gl2.NEAREST);
      gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_S, gl2.CLAMP_TO_EDGE);
      gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_T, gl2.CLAMP_TO_EDGE);
      gl2.texImage2D(
        gl2.TEXTURE_2D,
        0,
        internalFormat,
        4,
        4,
        0,
        format,
        type,
        null
      );
      const fbo = gl2.createFramebuffer();
      if (!fbo) return false;
      gl2.bindFramebuffer(gl2.FRAMEBUFFER, fbo);
      gl2.framebufferTexture2D(
        gl2.FRAMEBUFFER,
        gl2.COLOR_ATTACHMENT0,
        gl2.TEXTURE_2D,
        texture,
        0
      );
      const status = gl2.checkFramebufferStatus(gl2.FRAMEBUFFER);
      return status === gl2.FRAMEBUFFER_COMPLETE;
    }
    function hashCode(s) {
      if (!s.length) return 0;
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }
    function addKeywords(source, keywords) {
      if (!keywords) return source;
      let keywordsString = "";
      for (const keyword of keywords) {
        keywordsString += `#define ${keyword}
`;
      }
      return keywordsString + source;
    }
    function compileShader(type, source, keywords = null) {
      const shaderSource = addKeywords(source, keywords);
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.trace(gl.getShaderInfoLog(shader));
      }
      return shader;
    }
    function createProgram(vertexShader, fragmentShader) {
      if (!vertexShader || !fragmentShader) return null;
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.trace(gl.getProgramInfoLog(program));
      }
      return program;
    }
    function getUniforms(program) {
      let uniforms = {};
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const uniformInfo = gl.getActiveUniform(program, i);
        if (uniformInfo) {
          uniforms[uniformInfo.name] = gl.getUniformLocation(
            program,
            uniformInfo.name
          );
        }
      }
      return uniforms;
    }
    class Program {
      constructor(vertexShader, fragmentShader) {
        __publicField(this, "program");
        __publicField(this, "uniforms");
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = this.program ? getUniforms(this.program) : {};
      }
      bind() {
        if (this.program) gl.useProgram(this.program);
      }
    }
    class Material {
      constructor(vertexShader, fragmentShaderSource) {
        __publicField(this, "vertexShader");
        __publicField(this, "fragmentShaderSource");
        __publicField(this, "programs");
        __publicField(this, "activeProgram");
        __publicField(this, "uniforms");
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = {};
        this.activeProgram = null;
        this.uniforms = {};
      }
      setKeywords(keywords) {
        let hash = 0;
        for (const kw of keywords) {
          hash += hashCode(kw);
        }
        let program = this.programs[hash];
        if (program == null) {
          const fragmentShader = compileShader(
            gl.FRAGMENT_SHADER,
            this.fragmentShaderSource,
            keywords
          );
          program = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = program;
        }
        if (program === this.activeProgram) return;
        if (program) {
          this.uniforms = getUniforms(program);
        }
        this.activeProgram = program;
      }
      bind() {
        if (this.activeProgram) {
          gl.useProgram(this.activeProgram);
        }
      }
    }
    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `
    );
    const copyShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
          gl_FragColor = texture2D(uTexture, vUv);
      }
    `
    );
    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `
    );
    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `;
    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `
    );
    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);

          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }

      void main () {
          #ifdef MANUAL_FILTERING
              vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
              vec4 result = bilerp(uSource, coord, dyeTexelSize);
          #else
              vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
              vec4 result = texture2D(uSource, coord);
          #endif
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
      }
    `,
      ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]
    );
    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;

          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }

          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `
    );
    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `
    );
    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;

          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;

          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
    );
    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `
    );
    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
    );
    const blit = (() => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW
      );
      const elemBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      return (target, doClear = false) => {
        if (!gl) return;
        if (!target) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        if (doClear) {
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();
    let dye;
    let velocity;
    let divergence;
    let curl;
    let pressure;
    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new Program(
      baseVertexShader,
      gradientSubtractShader
    );
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);
    function createFBO(w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null
      );
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const texelSizeX = 1 / w;
      const texelSizeY = 1 / h;
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        }
      };
    }
    function createDoubleFBO(w, h, internalFormat, format, type, param) {
      const fbo1 = createFBO(w, h, internalFormat, format, type, param);
      const fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        read: fbo1,
        write: fbo2,
        swap() {
          const tmp = this.read;
          this.read = this.write;
          this.write = tmp;
        }
      };
    }
    function resizeFBO(target, w, h, internalFormat, format, type, param) {
      const newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      if (copyProgram.uniforms.uTexture)
        gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO, false);
      return newFBO;
    }
    function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(
        target.read,
        w,
        h,
        internalFormat,
        format,
        type,
        param
      );
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1 / w;
      target.texelSizeY = 1 / h;
      return target;
    }
    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);
      if (!dye) {
        dye = createDoubleFBO(
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );
      } else {
        dye = resizeDoubleFBO(
          dye,
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );
      }
      if (!velocity) {
        velocity = createDoubleFBO(
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      } else {
        velocity = resizeDoubleFBO(
          velocity,
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      }
      divergence = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
      curl = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
    }
    function updateKeywords() {
      const displayKeywords = [];
      if (config.SHADING) displayKeywords.push("SHADING");
      displayMaterial.setKeywords(displayKeywords);
    }
    function getResolution(resolution) {
      const w = gl.drawingBufferWidth;
      const h = gl.drawingBufferHeight;
      const aspectRatio = w / h;
      let aspect = aspectRatio < 1 ? 1 / aspectRatio : aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspect);
      if (w > h) {
        return { width: max, height: min };
      }
      return { width: min, height: max };
    }
    function scaleByPixelRatio(input) {
      const pixelRatio = window.devicePixelRatio || 1;
      return Math.floor(input * pixelRatio);
    }
    updateKeywords();
    initFramebuffers();
    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0;
    function updateFrame() {
      const dt = calcDeltaTime();
      if (resizeCanvas()) initFramebuffers();
      updateColors(dt);
      applyInputs();
      step(dt);
      render(null);
      requestAnimationFrame(updateFrame);
    }
    function calcDeltaTime() {
      const now = Date.now();
      let dt = (now - lastUpdateTime) / 1e3;
      dt = Math.min(dt, 0.016666);
      lastUpdateTime = now;
      return dt;
    }
    function resizeCanvas() {
      const width = scaleByPixelRatio(canvas.clientWidth);
      const height = scaleByPixelRatio(canvas.clientHeight);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }
    function updateColors(dt) {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
        pointers.forEach((p) => {
          p.color = generateColor();
        });
      }
    }
    function applyInputs() {
      for (const p of pointers) {
        if (p.moved) {
          p.moved = false;
          splatPointer(p);
        }
      }
    }
    function step(dt) {
      gl.disable(gl.BLEND);
      curlProgram.bind();
      if (curlProgram.uniforms.texelSize) {
        gl.uniform2f(
          curlProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (curlProgram.uniforms.uVelocity) {
        gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      }
      blit(curl);
      vorticityProgram.bind();
      if (vorticityProgram.uniforms.texelSize) {
        gl.uniform2f(
          vorticityProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (vorticityProgram.uniforms.uVelocity) {
        gl.uniform1i(
          vorticityProgram.uniforms.uVelocity,
          velocity.read.attach(0)
        );
      }
      if (vorticityProgram.uniforms.uCurl) {
        gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      }
      if (vorticityProgram.uniforms.curl) {
        gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      }
      if (vorticityProgram.uniforms.dt) {
        gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      }
      blit(velocity.write);
      velocity.swap();
      divergenceProgram.bind();
      if (divergenceProgram.uniforms.texelSize) {
        gl.uniform2f(
          divergenceProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (divergenceProgram.uniforms.uVelocity) {
        gl.uniform1i(
          divergenceProgram.uniforms.uVelocity,
          velocity.read.attach(0)
        );
      }
      blit(divergence);
      clearProgram.bind();
      if (clearProgram.uniforms.uTexture) {
        gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      }
      if (clearProgram.uniforms.value) {
        gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      }
      blit(pressure.write);
      pressure.swap();
      pressureProgram.bind();
      if (pressureProgram.uniforms.texelSize) {
        gl.uniform2f(
          pressureProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (pressureProgram.uniforms.uDivergence) {
        gl.uniform1i(
          pressureProgram.uniforms.uDivergence,
          divergence.attach(0)
        );
      }
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        if (pressureProgram.uniforms.uPressure) {
          gl.uniform1i(
            pressureProgram.uniforms.uPressure,
            pressure.read.attach(1)
          );
        }
        blit(pressure.write);
        pressure.swap();
      }
      gradienSubtractProgram.bind();
      if (gradienSubtractProgram.uniforms.texelSize) {
        gl.uniform2f(
          gradienSubtractProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (gradienSubtractProgram.uniforms.uPressure) {
        gl.uniform1i(
          gradienSubtractProgram.uniforms.uPressure,
          pressure.read.attach(0)
        );
      }
      if (gradienSubtractProgram.uniforms.uVelocity) {
        gl.uniform1i(
          gradienSubtractProgram.uniforms.uVelocity,
          velocity.read.attach(1)
        );
      }
      blit(velocity.write);
      velocity.swap();
      advectionProgram.bind();
      if (advectionProgram.uniforms.texelSize) {
        gl.uniform2f(
          advectionProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (!ext.supportLinearFiltering && advectionProgram.uniforms.dyeTexelSize) {
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      const velocityId = velocity.read.attach(0);
      if (advectionProgram.uniforms.uVelocity) {
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      }
      if (advectionProgram.uniforms.uSource) {
        gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      }
      if (advectionProgram.uniforms.dt) {
        gl.uniform1f(advectionProgram.uniforms.dt, dt);
      }
      if (advectionProgram.uniforms.dissipation) {
        gl.uniform1f(
          advectionProgram.uniforms.dissipation,
          config.VELOCITY_DISSIPATION
        );
      }
      blit(velocity.write);
      velocity.swap();
      if (!ext.supportLinearFiltering && advectionProgram.uniforms.dyeTexelSize) {
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          dye.texelSizeX,
          dye.texelSizeY
        );
      }
      if (advectionProgram.uniforms.uVelocity) {
        gl.uniform1i(
          advectionProgram.uniforms.uVelocity,
          velocity.read.attach(0)
        );
      }
      if (advectionProgram.uniforms.uSource) {
        gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      }
      if (advectionProgram.uniforms.dissipation) {
        gl.uniform1f(
          advectionProgram.uniforms.dissipation,
          config.DENSITY_DISSIPATION
        );
      }
      blit(dye.write);
      dye.swap();
    }
    function render(target) {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      drawDisplay(target);
    }
    function drawDisplay(target) {
      const width = gl.drawingBufferWidth;
      const height = gl.drawingBufferHeight;
      displayMaterial.bind();
      if (config.SHADING && displayMaterial.uniforms.texelSize) {
        gl.uniform2f(displayMaterial.uniforms.texelSize, 1 / width, 1 / height);
      }
      if (displayMaterial.uniforms.uTexture) {
        gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      }
      blit(target, false);
    }
    function splatPointer(pointer) {
      const dx = pointer.deltaX * config.SPLAT_FORCE;
      const dy = pointer.deltaY * config.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }
    function clickSplat(pointer) {
      const color = generateColor();
      color.r *= 10;
      color.g *= 10;
      color.b *= 10;
      const dx = 10 * (Math.random() - 0.5);
      const dy = 30 * (Math.random() - 0.5);
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    }
    function splat(x, y, dx, dy, color) {
      splatProgram.bind();
      if (splatProgram.uniforms.uTarget) {
        gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      }
      if (splatProgram.uniforms.aspectRatio) {
        gl.uniform1f(
          splatProgram.uniforms.aspectRatio,
          canvas.width / canvas.height
        );
      }
      if (splatProgram.uniforms.point) {
        gl.uniform2f(splatProgram.uniforms.point, x, y);
      }
      if (splatProgram.uniforms.color) {
        gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      }
      if (splatProgram.uniforms.radius) {
        gl.uniform1f(
          splatProgram.uniforms.radius,
          correctRadius(config.SPLAT_RADIUS / 100)
        );
      }
      blit(velocity.write);
      velocity.swap();
      if (splatProgram.uniforms.uTarget) {
        gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      }
      if (splatProgram.uniforms.color) {
        gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      }
      blit(dye.write);
      dye.swap();
    }
    function correctRadius(radius) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }
    function updatePointerDownData(pointer, id, posX, posY) {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1 - posY / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = generateColor();
    }
    function updatePointerMoveData(pointer, posX, posY, color) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1 - posY / canvas.height;
      pointer.deltaX = correctDeltaX(
        pointer.texcoordX - pointer.prevTexcoordX
      );
      pointer.deltaY = correctDeltaY(
        pointer.texcoordY - pointer.prevTexcoordY
      );
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      pointer.color = color;
    }
    function updatePointerUpData(pointer) {
      pointer.down = false;
    }
    function correctDeltaX(delta) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    }
    function correctDeltaY(delta) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    }
    function generateColor() {
      const c = HSVtoRGB(Math.random(), 1, 1);
      c.r *= 0.15;
      c.g *= 0.15;
      c.b *= 0.15;
      return c;
    }
    function HSVtoRGB(h, s, v) {
      let r = 0, g = 0, b = 0;
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
          break;
      }
      return { r, g, b };
    }
    function wrap(value, min, max) {
      const range = max - min;
      return (value - min) % range + min;
    }
    window.addEventListener("mousedown", (e) => {
      const pointer = pointers[0];
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      updatePointerDownData(pointer, -1, posX, posY);
      clickSplat(pointer);
    });
    function handleFirstMouseMove(e) {
      const pointer = pointers[0];
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      const color = generateColor();
      updateFrame();
      updatePointerMoveData(pointer, posX, posY, color);
      document.body.removeEventListener("mousemove", handleFirstMouseMove);
    }
    document.body.addEventListener("mousemove", handleFirstMouseMove);
    window.addEventListener("mousemove", (e) => {
      const pointer = pointers[0];
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      const color = pointer.color;
      updatePointerMoveData(pointer, posX, posY, color);
    });
    function handleFirstTouchStart(e) {
      const touches = e.targetTouches;
      const pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        const posX = scaleByPixelRatio(touches[i].clientX);
        const posY = scaleByPixelRatio(touches[i].clientY);
        updateFrame();
        updatePointerDownData(pointer, touches[i].identifier, posX, posY);
      }
      document.body.removeEventListener("touchstart", handleFirstTouchStart);
    }
    document.body.addEventListener("touchstart", handleFirstTouchStart);
    window.addEventListener(
      "touchstart",
      (e) => {
        const touches = e.targetTouches;
        const pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) {
          const posX = scaleByPixelRatio(touches[i].clientX);
          const posY = scaleByPixelRatio(touches[i].clientY);
          updatePointerDownData(pointer, touches[i].identifier, posX, posY);
        }
      },
      false
    );
    window.addEventListener(
      "touchmove",
      (e) => {
        const touches = e.targetTouches;
        const pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) {
          const posX = scaleByPixelRatio(touches[i].clientX);
          const posY = scaleByPixelRatio(touches[i].clientY);
          updatePointerMoveData(pointer, posX, posY, pointer.color);
        }
      },
      false
    );
    window.addEventListener("touchend", (e) => {
      const touches = e.changedTouches;
      const pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        updatePointerUpData(pointer);
      }
    });
  }, [
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR,
    TRANSPARENT
  ]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        pointerEvents: "none",
        width: "100%",
        height: "100%"
      },
      children: /* @__PURE__ */ jsx(
        "canvas",
        {
          ref: canvasRef,
          id: "fluid",
          style: {
            width: "100vw",
            height: "100vh",
            display: "block"
          }
        }
      )
    }
  );
}
const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.25)"
}) => {
  const divRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: divRef,
      onMouseMove: handleMouseMove,
      className: `card-spotlight ${className}`,
      children
    }
  );
};
gsap.registerPlugin(ScrollTrigger, SplitText$1);
const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const scrollTriggerRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined" || !ref.current || !text) return;
    const el = ref.current;
    animationCompletedRef.current = false;
    const absoluteLines = splitType === "lines";
    if (absoluteLines) el.style.position = "relative";
    let splitter;
    try {
      splitter = new SplitText$1(el, {
        type: splitType,
        absolute: absoluteLines,
        linesClass: "split-line"
      });
    } catch (error) {
      console.error("Failed to create SplitText:", error);
      return;
    }
    let targets;
    switch (splitType) {
      case "lines":
        targets = splitter.lines;
        break;
      case "words":
        targets = splitter.words;
        break;
      case "chars":
        targets = splitter.chars;
        break;
      default:
        targets = splitter.chars;
    }
    if (!targets || targets.length === 0) {
      console.warn("No targets found for SplitText animation");
      splitter.revert();
      return;
    }
    targets.forEach((t) => {
      t.style.willChange = "transform, opacity";
    });
    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
    const sign = marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
        once: true,
        onToggle: (self) => {
          scrollTriggerRef.current = self;
        }
      },
      smoothChildTiming: true,
      onComplete: () => {
        animationCompletedRef.current = true;
        gsap.set(targets, {
          ...to,
          clearProps: "willChange",
          immediateRender: true
        });
        onLetterAnimationComplete == null ? void 0 : onLetterAnimationComplete();
      }
    });
    tl.set(targets, { ...from, immediateRender: false, force3D: true });
    tl.to(targets, {
      ...to,
      duration,
      ease,
      stagger: delay / 1e3,
      force3D: true
    });
    return () => {
      tl.kill();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      gsap.killTweensOf(targets);
      if (splitter) {
        splitter.revert();
      }
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete
  ]);
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      className: `split-parent ${className}`,
      style: {
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word"
      },
      children: text
    }
  );
};
const meta = generateSEOMeta;
function FaqItem({
  question,
  answer
}) {
  const [isOpen, setIsOpen] = useState(false);
  return /* @__PURE__ */ jsxs(motion.div, {
    layout: true,
    onClick: () => setIsOpen(!isOpen),
    className: "border-b border-gray-300 py-4 cursor-pointer",
    initial: {
      borderRadius: 10
    },
    children: [/* @__PURE__ */ jsxs(motion.div, {
      layout: true,
      className: "flex justify-between items-center",
      children: [/* @__PURE__ */ jsx("h4", {
        className: "font-semibold text-lg text-gray-800",
        children: question
      }), /* @__PURE__ */ jsx(motion.div, {
        animate: {
          rotate: isOpen ? 180 : 0
        },
        children: /* @__PURE__ */ jsx("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          className: "h-6 w-6 text-purple-600",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: /* @__PURE__ */ jsx("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M19 9l-7 7-7-7"
          })
        })
      })]
    }), isOpen && /* @__PURE__ */ jsx(motion.div, {
      initial: {
        opacity: 0
      },
      animate: {
        opacity: 1
      },
      transition: {
        duration: 0.5
      },
      className: "pt-4 text-gray-600",
      children: answer
    })]
  });
}
const _index = UNSAFE_withComponentProps(function LandingPage() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const containerRef = useRef(null);
  const {
    scrollYProgress
  } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const eventTypes = [{
    title: "Custom Wedding Anthems",
    description: "Immortalize your love story. We craft unique songs for your Haldi, Mehendi, or Sangeet, weaving your names, memories, and journey into a beautiful anthem for your special day.",
    gradient: "from-pink-500 to-purple-600",
    icon: "💒"
  }, {
    title: "Corporate & Brand Anthems",
    description: "Elevate your brand with a unique sonic identity. We produce custom jingles, promotional music, and official anthems that capture your brand's message and resonate with your audience.",
    gradient: "from-green-500 to-emerald-600",
    icon: "💼"
  }, {
    title: "Devotional & Cultural Music",
    description: "Honor your faith and heritage with custom devotional songs. We compose personalized bhajans and tracks for religious gatherings like Bhagwat katha, mata ki chowki, and community festivals.",
    gradient: "from-red-500 to-pink-600",
    icon: "🎭"
  }, {
    title: "Celebration & Party Tracks",
    description: "Energize any celebration, from birthdays to anniversaries. We compose custom tracks for dance competitions or flash mobs, creating music that matches the vibe and gets everyone moving.",
    gradient: "from-blue-500 to-cyan-500",
    icon: "🎉"
  }, {
    title: "Instrumentals & Scores",
    description: "Need a unique background score? We create instrumental-only tracks for videos, presentations, or podcasts that need a one-of-a-kind sound without vocals.",
    gradient: "from-yellow-500 to-orange-500",
    icon: "🎵"
  }, {
    title: "Songs for Special Moments",
    description: "From a heartfelt proposal to a family slideshow, we create the perfect musical backdrop. Tell us the moment, and we'll write its soundtrack.",
    gradient: "from-indigo-500 to-purple-600",
    icon: "✨"
  }];
  const testimonials = [{
    quote: "Hearing our love story turned into a song was the most magical part of our wedding. The team captured our journey perfectly. Our families had it on repeat during the whole Sangeet!",
    name: "Aisha and Vikram Patel",
    event: "Custom Wedding Anthem"
  }, {
    quote: "The jingle they created for our new product launch was incredibly catchy and professional. It perfectly matched our brand's energy and has been a huge hit in our marketing campaign.",
    name: "Riya Sharma, Marketing Head",
    event: "Corporate Jingle"
  }, {
    quote: "I commissioned a surprise song for my parents' 50th anniversary, and it was the best gift I could have given. They wove in so many family memories. There wasn't a dry eye in the room.",
    name: "Arjun Desai",
    event: "Anniversary Song"
  }, {
    quote: "The devotional song created for our community event was soulful and beautifully composed. It set the perfect tone for the evening and was appreciated by everyone.",
    name: "Priya Mehta",
    event: "Devotional Song"
  }, {
    quote: "Our brand anthem has been a game-changer. It's energetic, memorable, and captures our company's spirit perfectly. The team was a pleasure to work with.",
    name: "Sameer Verma, CEO",
    event: "Brand Anthem"
  }, {
    quote: "I wanted a unique birthday song for my daughter, and they delivered beyond my expectations. It was the highlight of the party!",
    name: "Neha Gupta",
    event: "Birthday Song"
  }];
  const faqs = [{
    categoryTitle: "A. About Our Service",
    items: [{
      question: "What exactly do you create?",
      answer: "We craft fully customized songs—lyrics, composition, vocals or instrumental tracks—tailored to your event, brand, or personal story."
    }, {
      question: "Which occasions do you serve?",
      answer: "Family ceremonies (haldi, mehndi, sangeet, birthdays, anniversaries), religious gatherings (Bhagwat katha, mata ki chowki, jagran), community festivals, corporate promos, dance competitions—essentially any function needing a unique soundtrack."
    }, {
      question: "Do you handle corporate projects?",
      answer: "Yes. We compose jingles, anthems, promotional tracks, and sonic logos that match brand guidelines and campaign goals."
    }, {
      question: "Can I order instrumental-only tracks?",
      answer: "Absolutely. Choose full vocals, instrumental, or mixed versions."
    }, {
      question: "In which languages can you write lyrics?",
      answer: "Hindi, English, Punjabi, Bhojpuri, Gujarati, Marathi—plus most Indian regional languages on request."
    }, {
      question: "What musical styles can you produce?",
      answer: "From devotional bhajans to Bollywood, EDM, folk, lo-fi, and orchestral—you name the vibe, we compose it."
    }, {
      question: 'Is the music truly "personalized"?',
      answer: "Yes. We incorporate your stories, names, slogans, or spiritual verses so the song feels one-of-a-kind."
    }, {
      question: "Do you cover dance routines or flash-mobs?",
      answer: "Yes. We can build tempo, drop points, and loop sections specifically for choreographed performances."
    }, {
      question: "Who owns the song after delivery?",
      answer: "You receive 100% master and publishing rights—but we jointly register the track so you also earn 50% lifetime royalties from streaming platforms."
    }, {
      question: "Can I keep the song private?",
      answer: `Sure. Just select the "private release" option and we won't publish it publicly.`
    }]
  }, {
    categoryTitle: "B. Process & Turnaround",
    items: [{
      question: "How do I start an order?",
      answer: "Fill our online brief or call our team, share event details, musical taste, preferred language, and any must-mention names or themes."
    }, {
      question: "What is the standard delivery time?",
      answer: "4 calendar days."
    }, {
      question: 'Do you offer a rush or "emergency" service?',
      answer: "Yes—48-hour turnaround. Rush fees apply because we prioritize studio time and extra staff."
    }, {
      question: "How many concepts will I receive?",
      answer: "We typically provide two distinct melody/arrangement ideas; you pick one for full production."
    }, {
      question: "How many revisions are included?",
      answer: "Two revision rounds (lyrics or mix tweaks) are complimentary. Extra rounds are billed modestly."
    }, {
      question: "Can I choose the singer?",
      answer: "Yes. We maintain a roster of male, female, and choir vocalists across genres. Singer choice may affect pricing."
    }, {
      question: "Can you integrate my own voice clips?",
      answer: "It depends on the circumstances—specifically the audio quality and how well the clips fit the arrangement. Share your recordings with us and we'll confirm feasibility."
    }, {
      question: "What if I need lyrics only?",
      answer: "We offer standalone lyric-writing with optional basic composition for your own arranger."
    }]
  }, {
    categoryTitle: "C. Formats & Delivery",
    items: [{
      question: "Which file types do you supply?",
      answer: "High-quality WAV (24-bit) and MP3 (320 kbps) by default; AAC, FLAC, or stems are available on request."
    }, {
      question: "How will I receive my files?",
      answer: "Via a secure download link plus a cloud backup that remains active for one year."
    }, {
      question: "Can I request different lengths (e.g., 30-sec)?",
      answer: "Yes—radio edits, reels, teasers, or looped background versions are included if specified upfront."
    }, {
      question: "Is mastering included?",
      answer: "Every track is professionally mixed and mastered to broadcast standards (-14 LUFS for streaming)."
    }, {
      question: "Do you provide karaoke versions?",
      answer: "Yes—a vocal-free mix is supplied at no extra cost."
    }]
  }, {
    categoryTitle: "D. Publishing & Royalties",
    items: [{
      question: "Which platforms will my song appear on?",
      answer: "30+ outlets including Spotify, Apple Music, Amazon Music, JioSaavn, Gaana, YouTube & YouTube Music, Instagram Reels, Facebook, Snapchat Sounds, and more."
    }, {
      question: "How long does publishing take?",
      answer: "3–7 days after you sign off the master."
    }, {
      question: "How does the 50% lifetime royalty work?",
      answer: "We handle distribution and collect royalties; 50% of net streaming income is transferred to you quarterly."
    }, {
      question: "Who manages streaming distribution and dashboards?",
      answer: "Our distribution partner Own Sangeet uploads your track and handles royalty collection. You'll receive secure dashboard access through them to monitor streams and earnings in real time."
    }, {
      question: "Will my name show as the artist?",
      answer: `Choose "Artist Attribution" at checkout and we'll list you (or a stage name) as the primary or featured artist.`
    }]
  }, {
    categoryTitle: "E. Pricing & Payment",
    items: [{
      question: "How is pricing calculated?",
      answer: "Scope factors include lyrical complexity, singer tier, instrumentation, language, and turnaround speed."
    }, {
      question: "What payment methods do you accept?",
      answer: "UPI, credit/debit cards, bank transfer, PayPal, and corporate PO for businesses."
    }, {
      question: "Is there a deposit?",
      answer: "Yes—a 50% advance begins production; balance is due upon final approval."
    }, {
      question: "Are there any hidden costs?",
      answer: "None. All charges are quoted upfront, including distribution and copyright registration fees."
    }, {
      question: "Do you offer discounts for multiple songs?",
      answer: "Yes—bundle pricing and loyalty credits for repeat clients and event planners."
    }]
  }, {
    categoryTitle: "F. Legal & Copyright",
    items: [{
      question: "Do I need to worry about copyright strikes?",
      answer: "No. We create original compositions and handle copyright registration to protect you."
    }, {
      question: "Can I monetize videos using the song?",
      answer: "Yes—you're free to use the track in monetized YouTube or social-media content."
    }, {
      question: "Can I resell or license the song to others?",
      answer: "Yes, once you hold the rights, you may license it further, though we'd love to help negotiate fair terms."
    }, {
      question: "What if someone else claims my music?",
      answer: "Provide the claim notice; our legal team will issue a takedown or ownership proof within 48 hours."
    }, {
      question: "Do you sign NDAs for private events?",
      answer: "Of course—confidentiality agreements are standard for corporate or sensitive family projects."
    }]
  }, {
    categoryTitle: "G. Support & After-Sales",
    items: [{
      question: "How do I contact you?",
      answer: "WhatsApp, email, or our 24/7 hotline. Response time: under 2 hours during business days."
    }, {
      question: "Do you offer on-site performance or DJ services?",
      answer: "No, we currently don't provide on-site performance or DJ services, but we can recommend trusted partners if needed."
    }, {
      question: "What if I lose my files later?",
      answer: "We keep a secure archive; re-delivery is free during the first year and nominal afterward."
    }, {
      question: "Can you create lyric videos or reels?",
      answer: 'Yes—add our "visual bundle" for animated lyric videos, vertical reels, and teaser clips.'
    }, {
      question: "Do you provide ISRC and UPC codes?",
      answer: "Yes—they're included for global digital distribution and royalty tracking."
    }]
  }, {
    categoryTitle: "H. Special Requests & Extras",
    items: [{
      question: "Can you sync songs to photo slideshows?",
      answer: "Yes—provide images and we'll align the music dynamically."
    }, {
      question: "Do you compose theme music for podcasts or YouTube intros?",
      answer: 'Certainly—select "Digital Branding Package" for shorter stingers and loops.'
    }, {
      question: "Can you handle multiregional medleys?",
      answer: "Yes—we can merge multiple languages or styles into one seamless medley."
    }, {
      question: "Do you offer voiceovers or spoken blessings?",
      answer: "Yes—celebrity voiceovers, shlokas, or parental blessings can be layered into the track."
    }, {
      question: "What if I'm not satisfied?",
      answer: 'Our "Love-It Guarantee" lets you request additional revisions or a partial refund per our policy—though 97% of clients sign off on the first master!'
    }]
  }];
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-gray-800",
    children: [/* @__PURE__ */ jsx("header", {
      className: "fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-md border-b border-gray-200",
      children: /* @__PURE__ */ jsx("div", {
        className: "container mx-auto px-6 py-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between",
          children: [/* @__PURE__ */ jsxs("h1", {
            className: "flex items-center text-2xl font-bold text-gray-800",
            children: [/* @__PURE__ */ jsx("img", {
              src: "/favicon.ico",
              alt: "Own Sangeet Custom Music Studio logo",
              className: "h-8 w-8 mr-2"
            }), "Own Sangeet"]
          }), /* @__PURE__ */ jsx("nav", {
            className: "hidden md:flex space-x-8",
            children: ["Home", "Services", "About", "Gallery", "Testimonials", "FAQ", "Contact"].map((item) => /* @__PURE__ */ jsx("a", {
              href: `#${item.toLowerCase()}`,
              className: "text-gray-600 hover:text-purple-600 transition-colors",
              children: item
            }, item))
          })]
        })
      })
    }), /* @__PURE__ */ jsxs("section", {
      id: "home",
      className: "min-h-screen flex flex-col items-center justify-center text-center pt-24 pb-12 px-6",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "relative z-10",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-6xl md:text-8xl font-bold mb-6 text-pink-500",
          children: /* @__PURE__ */ jsx(SplitText, {
            text: "Your Story, Your Song",
            className: "text-6xl md:text-8xl font-bold mb-6 text-pink-500",
            splitType: "chars",
            delay: 40,
            duration: 0.7,
            ease: "power3.out",
            from: {
              opacity: 0,
              y: 40
            },
            to: {
              opacity: 1,
              y: 0
            },
            threshold: 0.2,
            rootMargin: "-100px",
            textAlign: "center"
          })
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xl md:text-2xl mb-8 text-gray-600 max-w-2xl mx-auto",
          children: "We craft unforgettable, custom-made songs for all of life's biggest moments. From wedding anthems to corporate jingles, we turn your ideas into music."
        }), /* @__PURE__ */ jsx("button", {
          className: "bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all",
          onClick: () => setIsContactFormOpen(true),
          children: "Get Started"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "relative w-full h-[400px] md:h-[500px] mt-12",
        children: /* @__PURE__ */ jsx(Spline, {
          scene: "https://prod.spline.design/P4AURWuUXAVq9IvP/scene.splinecode",
          style: {
            width: "100%",
            height: "100%"
          }
        })
      })]
    }), /* @__PURE__ */ jsx("section", {
      className: "relative h-96 -mt-48 pointer-events-none",
      children: /* @__PURE__ */ jsx("div", {
        className: "absolute inset-0 overflow-hidden",
        children: /* @__PURE__ */ jsx("div", {
          className: "crazy-element"
        })
      })
    }), /* @__PURE__ */ jsx("section", {
      id: "services",
      className: "py-20 px-6",
      children: /* @__PURE__ */ jsxs("div", {
        className: "container mx-auto",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "text-center mb-16",
          children: [/* @__PURE__ */ jsx("h2", {
            className: "text-4xl md:text-5xl font-bold text-gray-800 mb-6",
            children: "Custom Songs for Every Occasion"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xl text-gray-600 max-w-3xl mx-auto",
            children: "From intimate gatherings to grand celebrations, we provide a truly personal soundtrack for your most important events."
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
          children: eventTypes.map((event, index) => /* @__PURE__ */ jsxs(SpotlightCard, {
            className: "group relative",
            spotlightColor: "rgba(147, 51, 234, 0.15)",
            children: [/* @__PURE__ */ jsx("div", {
              className: `absolute inset-0 bg-gradient-to-br ${event.gradient} rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity`
            }), /* @__PURE__ */ jsxs("div", {
              className: "relative p-8",
              children: [/* @__PURE__ */ jsx("div", {
                className: "text-4xl mb-4",
                children: event.icon
              }), /* @__PURE__ */ jsx("h3", {
                className: "text-2xl font-bold text-gray-800 mb-4",
                children: event.title
              }), /* @__PURE__ */ jsx("p", {
                className: "text-gray-600 leading-relaxed",
                children: event.description
              }), /* @__PURE__ */ jsx("button", {
                className: "mt-6 bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-2 rounded-full transition-all",
                children: "Learn More"
              })]
            })]
          }, event.title))
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      id: "about",
      className: "py-20 px-6 bg-white",
      children: /* @__PURE__ */ jsxs("div", {
        className: "container mx-auto text-center",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-4xl md:text-5xl font-bold text-gray-800 mb-6",
          children: "Your Personal Songwriting Studio"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xl text-gray-600 max-w-3xl mx-auto",
          children: "Music Studio was founded on a simple idea: every story deserves its own song. We are a collective of passionate songwriters, composers, and producers dedicated to transforming your memories, feelings, and ideas into one-of-a-kind musical pieces."
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      id: "gallery",
      className: "py-20 bg-white/50",
      children: /* @__PURE__ */ jsxs("div", {
        className: "container mx-auto",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "text-center mb-16",
          children: [/* @__PURE__ */ jsx("h2", {
            className: "text-4xl md:text-5xl font-bold text-gray-800 mb-6",
            children: "Event Gallery"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xl text-gray-600 max-w-3xl mx-auto",
            children: "A glimpse into the unforgettable moments we've helped create."
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "grid grid-cols-2 md:grid-cols-4 gap-4",
          children: [{
            src: "/photos/104545-7-phere-1.jpeg",
            alt: "Indian Wedding",
            audio: "/audios/104545-7-phere-1.mp3"
          }, {
            src: "/photos/Firstbirthday_delhiphotographer_birthdayphotography_photoshoot_photography_delhi_Gurgaon_candid_013.jpg",
            alt: "Birthday Party",
            audio: "/audios/Firstbirthday_delhiphotographer_birthdayphotography_photoshoot_photography_delhi_Gurgaon_candid_013.mp3"
          }, {
            src: "/photos/Group-dance-songs-_-WItty-Vows-_-Dream-Diaries.webp",
            alt: "Indian Party",
            audio: "/audios/Group-dance-songs-_-WItty-Vows-_-Dream-Diaries.mp3"
          }, {
            src: "/photos/haldi.jpg",
            alt: "Indian Culture",
            audio: "/audios/haldi.mp3"
          }, {
            src: "/photos/praposal.jpg",
            alt: "Proposal",
            audio: "/audios/praposal.mp3"
          }, {
            src: "/photos/special occasion.jpg",
            alt: "Special Occasion",
            audio: "/audios/special occasion.mp3"
          }, {
            src: "/photos/ladies-sangeet-gautam-khullar.jpeg",
            alt: "Ladies Sangeet",
            audio: "/audios/ladies-sangeet-gautam-khullar.mp3"
          }, {
            src: "/photos/8157b39c1e592d34df1e94f97a0173fc.png",
            alt: "Custom Event",
            audio: "/audios/8157b39c1e592d34df1e94f97a0173fc.mp3"
          }].map((image, index) => /* @__PURE__ */ jsxs("div", {
            className: "group relative aspect-square overflow-hidden rounded-lg",
            children: [/* @__PURE__ */ jsx(PhotoAudio, {
              imageSrc: image.src,
              alt: image.alt,
              audioSrc: image.audio
            }), /* @__PURE__ */ jsx("div", {
              className: "absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none"
            })]
          }, index))
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      id: "testimonials",
      className: "py-20 px-6 bg-white",
      children: /* @__PURE__ */ jsxs("div", {
        className: "container mx-auto",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-center mb-16",
          children: /* @__PURE__ */ jsx("h2", {
            className: "text-4xl md:text-5xl font-bold text-gray-800 mb-6",
            children: "What Our Clients Say"
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "grid grid-cols-1 md:grid-cols-3 gap-8",
          children: testimonials.map((testimonial, index) => /* @__PURE__ */ jsxs(SpotlightCard, {
            className: "bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-purple-200/50 hover:border-purple-300 transition-all group",
            spotlightColor: "rgba(236, 72, 153, 0.12)",
            children: [/* @__PURE__ */ jsxs("p", {
              className: "text-gray-600 mb-4 italic",
              children: ['"', testimonial.quote, '"']
            }), /* @__PURE__ */ jsxs("div", {
              className: "font-bold text-gray-800 mt-6",
              children: ["- ", testimonial.name]
            }), /* @__PURE__ */ jsx("div", {
              className: "text-sm text-purple-600 font-medium",
              children: testimonial.event
            })]
          }, index))
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      id: "faq",
      className: "py-20 px-6 bg-white/50",
      children: /* @__PURE__ */ jsxs("div", {
        className: "container mx-auto",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "text-center mb-16",
          children: [/* @__PURE__ */ jsx("h2", {
            className: "text-4xl md:text-5xl font-bold text-gray-800 mb-6",
            children: "Frequently Asked Questions"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xl text-gray-600 max-w-3xl mx-auto",
            children: "Have questions? We've got answers. Here are the details about our custom song creation process."
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "max-w-3xl mx-auto",
          children: faqs.map((category, catIndex) => /* @__PURE__ */ jsxs("div", {
            className: "mb-6",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "text-3xl font-bold text-gray-800 mt-8 mb-4 border-b-2 border-purple-200 pb-2",
              children: category.categoryTitle
            }), category.items.map((faq, index) => /* @__PURE__ */ jsx(FaqItem, {
              question: faq.question,
              answer: faq.answer
            }, index))]
          }, catIndex))
        })]
      })
    }), /* @__PURE__ */ jsx("section", {
      id: "contact",
      className: "py-20 px-6",
      children: /* @__PURE__ */ jsxs("div", {
        className: "container mx-auto text-center",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-4xl md:text-5xl font-bold text-gray-800 mb-6",
          children: "Ready to Create Your Song?"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xl text-gray-600 mb-8 max-w-2xl mx-auto",
          children: "Let's discuss your event and create the perfect musical masterpiece that tells your story."
        }), /* @__PURE__ */ jsx("button", {
          className: "bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all",
          onClick: () => setIsContactFormOpen(true),
          children: "Contact Us Today"
        })]
      })
    }), /* @__PURE__ */ jsx("footer", {
      className: "bg-white/50 backdrop-blur-md border-t border-gray-200 py-8",
      children: /* @__PURE__ */ jsx("div", {
        className: "container mx-auto px-6 text-center",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col md:flex-row justify-between items-center",
          children: [/* @__PURE__ */ jsx("div", {
            className: "text-gray-600 mb-4 md:mb-0",
            children: "© 2024 Music Studio. All rights reserved."
          }), /* @__PURE__ */ jsx("div", {
            className: "flex space-x-6",
            children: ["Facebook", "Instagram", "Twitter", "YouTube"].map((social) => /* @__PURE__ */ jsx("a", {
              href: "#",
              className: "text-gray-600 hover:text-purple-600 transition-colors",
              children: social
            }, social))
          })]
        })
      })
    }), /* @__PURE__ */ jsx(AnimatePresence, {
      children: isContactFormOpen && /* @__PURE__ */ jsx(ContactForm, {
        onClose: () => setIsContactFormOpen(false)
      })
    }), /* @__PURE__ */ jsx("footer", {
      className: "bg-gray-800 text-white py-12",
      children: /* @__PURE__ */ jsxs("div", {
        className: "container mx-auto px-6 text-center",
        children: [/* @__PURE__ */ jsx("h3", {
          className: "text-2xl font-bold mb-4",
          children: "Get in Touch"
        }), /* @__PURE__ */ jsx("p", {
          className: "mb-6",
          children: "Have questions? We're here to help. Contact us directly or follow us on social media."
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-center items-center space-x-6 text-lg mb-8",
          children: [/* @__PURE__ */ jsxs("a", {
            href: "tel:+919098019901",
            className: "hover:text-purple-400 transition-colors",
            children: [/* @__PURE__ */ jsx("i", {
              className: "fas fa-phone mr-2"
            }), "+91 9098019901"]
          }), /* @__PURE__ */ jsxs("a", {
            href: "https://wa.me/919098019901",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:text-green-400 transition-colors",
            children: [/* @__PURE__ */ jsx("i", {
              className: "fab fa-whatsapp mr-2"
            }), "WhatsApp"]
          }), /* @__PURE__ */ jsxs("a", {
            href: "http://OwnSangeet.com",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:text-blue-400 transition-colors",
            children: [/* @__PURE__ */ jsx("i", {
              className: "fas fa-globe mr-2"
            }), "Own Sangeet.com"]
          })]
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-gray-500",
          children: ["© ", (/* @__PURE__ */ new Date()).getFullYear(), " Your Brand Name. All Rights Reserved."]
        })]
      })
    }), /* @__PURE__ */ jsx(SplashCursor, {
      SPLAT_RADIUS: 0.3,
      SPLAT_FORCE: 4e3,
      DENSITY_DISSIPATION: 2.5,
      VELOCITY_DISSIPATION: 1.8,
      COLOR_UPDATE_SPEED: 8
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-WabgBupn.js", "imports": ["/assets/chunk-QMGIS6GS-hoMvXFpG.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-Djvr2VYN.js", "imports": ["/assets/chunk-QMGIS6GS-hoMvXFpG.js"], "css": ["/assets/root-DCAPT-va.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-DS5A6wOb.js", "imports": ["/assets/_index-DiY6F6Jj.js", "/assets/chunk-QMGIS6GS-hoMvXFpG.js"], "css": ["/assets/_index-DUIyRB6X.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-1077d437.js", "version": "1077d437", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
