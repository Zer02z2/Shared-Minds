(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}})();const c={float:(e,t)=>{const o=Math.random()*(t-e);return e+o},integer:(e,t)=>Math.floor(c.float(e,t))},l=e=>{const t=e.getBoundingClientRect(),[o,n]=[t.left,t.top];return[o,n]},d=(e,t,o,n,r)=>{e.beginPath(),e.moveTo(t,o),e.lineTo(n,r),e.stroke()},a={createText:(e,t,o)=>{const n=document.createElement(e);if(t){const r=document.createTextNode(t);n.appendChild(r)}return o&&n.classList.add(o),n},createImage:(e,t,o)=>{const n=new Image;return n.src=e,n.alt=t,o&&n.classList.add(o),n},createDiv:e=>{const t=document.createElement("div");return e&&t.classList.add(e),t},createButton:(e,t)=>{const o=document.createElement("button");return e&&(o.textContent=e),t&&t.split(" ").forEach(r=>{o.classList.add(r)}),o}},u=e=>{for(;e.lastChild;)e.removeChild(e.lastChild)};export{a as H,c as R,l as g,d as l,u as r};
