<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nexus</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Söhne:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Söhne+Mono:wght@400;500&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js"></script>
<style>
  :root{
    /* ChatGPT-style near-black palette */
    --bg-0:#0d0d0d;           /* app background */
    --bg-sidebar:#000000;      /* sidebar */
    --bg-1:#171717;            /* raised surfaces / hover */
    --bg-2:#1f1f1f;            /* inputs, cards */
    --bg-3:#2a2a2a;            /* borders on surfaces */
    --line:#2a2a2a;
    --line-soft:#212121;
    --text-hi:#ececec;
    --text-mid:#b4b4b4;
    --text-lo:#8e8ea0;
    --text-faint:#676767;

    --nvidia:#10a37f;          /* ChatGPT green, repurposed as "nvidia" accent */
    --nvidia-dim:#0d8b6c;
    --nvidia-glow:rgba(16,163,127,.14);
    --openrouter:#ab68ff;      /* purple accent for second provider */
    --openrouter-dim:#8e4fe0;
    --openrouter-glow:rgba(171,104,255,.14);
    --danger:#f2555a;
    --warn:#e8b04b;
    --paper:#0d0d0d;
    --cfa:#e0b954;             /* topic-outline accent, warm gold */
    --cfa-dim:#c49f43;
    --cfa-glow:rgba(224,185,84,.14);
  }
  *{box-sizing:border-box;}
  html,body{height:100%;}
  body{margin:0;background:var(--paper);color:var(--text-hi);font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;-webkit-font-smoothing:antialiased;font-size:15px;}
  ::selection{background:rgba(16,163,127,.28);}
  ::-webkit-scrollbar{width:8px;height:8px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:var(--bg-3);border-radius:8px;}
  ::-webkit-scrollbar-thumb:hover{background:#3a3a3a;}
  @media (prefers-reduced-motion: reduce){*{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important;}}
  .mono{font-family:'IBM Plex Mono',monospace;}
  .display{font-family:'Inter',sans-serif;font-weight:600;letter-spacing:-.01em;}
  button{font-family:inherit;}

  /* ============ SHELL ============ */
  .shell{display:grid;grid-template-columns:52px 1fr;height:100vh;position:relative;}
  @media (max-width:880px){
    .shell{grid-template-columns:52px 1fr;}
  }

  /* ============ SIDEBAR — icon rail only, matches reference exactly ============ */
  .sidebar{background:var(--bg-sidebar);
    display:flex;flex-direction:column;align-items:center;padding:14px 0 10px;gap:14px;position:relative;z-index:2;min-height:0;overflow:hidden;width:52px;}

  .brand-row{display:flex;align-items:center;justify-content:center;padding:0;}
  .brand{display:flex;align-items:center;justify-content:center;}
  .brand-mark{width:26px;height:26px;flex:none;}
  .brand h1, .collapse-btn{display:none;}

  .rail-icon-btn{
    background:none;border:none;color:var(--text-mid);width:32px;height:32px;border-radius:8px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:background .12s ease,color .12s ease;flex:none;
  }
  .rail-icon-btn:hover{background:var(--bg-1);color:var(--text-hi);}

  .rail-spacer{flex:1;}

  .rail-row, .new-chat-btn, .sidebar-btn, .search-row, .convo-list, .sidebar-footer, .rail-actions{display:none;}

  /* ============ MAIN ============ */
  .main{display:flex;flex-direction:column;height:100vh;min-width:0;position:relative;z-index:2;background:var(--bg-0);}
  .topbar{display:flex;align-items:center;gap:13px;padding:13px 20px;background:rgba(13,13,13,.9);backdrop-filter:blur(8px);}
  .menu-btn{display:none;background:none;border:1px solid var(--line);color:var(--text-mid);width:32px;height:32px;border-radius:8px;cursor:pointer;flex:none;}
  @media (max-width:880px){.menu-btn{display:block;}}
  .route-chip{font-family:'Inter',sans-serif;font-size:12px;font-weight:500;padding:5px 12px 5px 9px;border-radius:100px;border:1px solid;display:flex;align-items:center;gap:6px;color:var(--text-hi);}
  .route-chip .rdot{width:6px;height:6px;border-radius:50%;background:currentColor;}
  .route-chip.nvidia{color:var(--nvidia);border-color:rgba(16,163,127,.35);background:var(--nvidia-glow);}
  .route-chip.openrouter{color:var(--openrouter);border-color:rgba(171,104,255,.35);background:var(--openrouter-glow);}
  .model-dropdown{display:flex;align-items:center;gap:5px;background:none;border:none;color:var(--text-hi);font-family:'Inter',sans-serif;font-size:16px;font-weight:600;cursor:pointer;padding:6px 8px;border-radius:8px;transition:background .12s ease;}
  .model-dropdown:hover{background:var(--bg-1);}
  .model-dropdown svg{color:var(--text-mid);}
  .topbar .spacer{flex:1;}
  .share-btn{display:flex;align-items:center;gap:7px;background:var(--bg-1);border:none;color:var(--text-hi);font-family:'Inter',sans-serif;font-size:13.5px;font-weight:500;padding:7px 14px;border-radius:20px;cursor:pointer;transition:background .12s ease;}
  .share-btn:hover{background:var(--bg-2);}
  .icon-btn{background:none;border:none;color:var(--text-mid);width:32px;height:32px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none;transition:background .15s,color .15s;}
  .icon-btn:hover{color:var(--text-hi);background:var(--bg-1);}

  .side-toggle{display:flex;align-items:center;gap:7px;background:var(--bg-1);border:1px solid var(--line);color:var(--text-mid);font-family:'Inter',sans-serif;font-size:12.5px;font-weight:500;padding:6px 13px 6px 11px;border-radius:20px;cursor:pointer;transition:border-color .15s,color .15s,background .15s;margin-right:8px;}
  .side-toggle .ddot{width:6px;height:6px;border-radius:50%;flex:none;background:var(--text-faint);transition:background .15s;}
  .side-toggle.on{color:var(--text-hi);border-color:var(--text-lo);background:var(--bg-2);}
  .side-toggle.on .ddot{background:var(--text-hi);}
  .side-toggle:hover{border-color:var(--text-lo);}

  .modes-toggle{display:flex;align-items:center;gap:7px;background:var(--bg-1);border:1px solid var(--line);color:var(--text-mid);font-family:'Inter',sans-serif;font-size:12.5px;font-weight:500;padding:6px 13px 6px 11px;border-radius:20px;cursor:pointer;transition:border-color .15s,color .15s,background .15s;margin-right:8px;max-width:260px;}
  .modes-toggle #modesLabel{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .modes-toggle .mdot{width:7px;height:7px;border-radius:50%;background:var(--text-faint);flex:none;transition:background .15s,box-shadow .15s;}
  .modes-toggle.on{color:var(--openrouter);border-color:rgba(171,104,255,.4);background:var(--openrouter-glow);}
  .modes-toggle.on .mdot{background:var(--openrouter);box-shadow:0 0 7px var(--openrouter);}
  .modes-toggle:hover{border-color:var(--text-lo);}
  .modes-toggle .mcount{font-family:'IBM Plex Mono',monospace;font-size:9.5px;font-weight:600;letter-spacing:.03em;opacity:.85;background:rgba(171,104,255,.22);color:var(--openrouter);border-radius:100px;padding:1px 6px;margin-left:1px;}

  .topics-toggle{display:flex;align-items:center;gap:7px;background:var(--bg-1);border:1px solid var(--line);color:var(--text-mid);font-family:'Inter',sans-serif;font-size:12.5px;font-weight:500;padding:6px 13px 6px 11px;border-radius:20px;cursor:pointer;transition:border-color .15s,color .15s,background .15s;margin-right:8px;}
  .topics-toggle .tdot{width:6px;height:6px;border-radius:50%;flex:none;background:var(--text-faint);transition:background .15s;}
  .topics-toggle.on{color:var(--cfa);border-color:rgba(224,185,84,.4);background:var(--cfa-glow);}
  .topics-toggle.on .tdot{background:var(--cfa);box-shadow:0 0 7px var(--cfa);}
  .topics-toggle:hover{border-color:var(--text-lo);}

  /* ============ MODES MODAL ============ */
  .modes-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;z-index:50;padding:20px;}
  .modes-overlay.show{display:flex;}
  .modes-modal{width:100%;max-width:760px;max-height:88vh;background:var(--bg-1);border:1px solid var(--line);border-radius:16px;display:flex;flex-direction:column;box-shadow:0 30px 80px rgba(0,0,0,.6);animation:modal-in .18s ease;}
  .modes-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:18px 22px 14px;border-bottom:1px solid var(--line-soft);flex:none;}
  .modes-head h2{margin:0;font-family:'Inter',sans-serif;font-size:15px;font-weight:600;color:var(--text-hi);display:flex;align-items:center;gap:9px;}
  .modes-head p{margin:4px 0 0;font-size:12px;color:var(--text-lo);line-height:1.5;}
  .modes-head .close-btn{background:none;border:none;color:var(--text-lo);cursor:pointer;padding:5px;border-radius:6px;flex:none;}
  .modes-head .close-btn:hover{color:var(--text-hi);background:var(--bg-2);}
  .modes-body{overflow-y:auto;padding:16px 22px 6px;flex:1;}
  .modes-group{margin-bottom:20px;}
  .modes-group-title{font-family:'IBM Plex Mono',monospace;font-size:10.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--text-faint);margin:0 0 10px;display:flex;align-items:center;gap:7px;}
  .modes-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}
  @media (max-width:620px){.modes-grid{grid-template-columns:1fr;}}
  .mode-card{display:flex;align-items:flex-start;gap:10px;text-align:left;background:var(--bg-2);border:1px solid var(--line);color:var(--text-mid);border-radius:10px;padding:10px 12px;cursor:pointer;transition:border-color .13s,background .13s,color .13s;}
  .mode-card:hover{border-color:var(--text-lo);}
  .mode-card.active{border-color:var(--openrouter-dim);background:var(--openrouter-glow);color:var(--text-hi);}
  .mode-card .mchk{width:16px;height:16px;border-radius:5px;border:1.5px solid var(--text-faint);flex:none;margin-top:1px;display:flex;align-items:center;justify-content:center;transition:border-color .13s,background .13s;}
  .mode-card.active .mchk{border-color:var(--openrouter);background:var(--openrouter);}
  .mode-card .mchk svg{opacity:0;transition:opacity .13s;}
  .mode-card.active .mchk svg{opacity:1;}
  .mode-card .mbody{min-width:0;}
  .mode-card .mname{font-family:'Inter',sans-serif;font-size:12.5px;font-weight:600;color:var(--text-hi);line-height:1.3;}
  .mode-card .mdesc{font-size:11.5px;color:var(--text-lo);line-height:1.4;margin-top:2px;}
  .modes-actions{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 22px;border-top:1px solid var(--line-soft);flex:none;}
  .modes-actions .mleft{font-size:12px;color:var(--text-lo);}
  .modes-actions .mleft button{background:none;border:none;color:var(--openrouter);cursor:pointer;font-size:12px;font-weight:500;padding:0;text-decoration:underline;text-underline-offset:2px;}
  .modes-actions .mright{display:flex;gap:8px;}

  /* ============ TOPICS MODAL — browse the CFA curriculum outline and request a detailed
     explanation of any module in one click ============ */
  .topics-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;z-index:51;padding:20px;}
  .topics-overlay.show{display:flex;}
  .topics-modal{width:100%;max-width:820px;max-height:88vh;background:var(--bg-1);border:1px solid var(--line);border-radius:16px;display:flex;flex-direction:column;box-shadow:0 30px 80px rgba(0,0,0,.6);animation:modal-in .18s ease;}
  .topics-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:18px 22px 14px;border-bottom:1px solid var(--line-soft);flex:none;}
  .topics-head h2{margin:0;font-family:'Inter',sans-serif;font-size:15px;font-weight:600;color:var(--text-hi);display:flex;align-items:center;gap:9px;}
  .topics-head p{margin:4px 0 0;font-size:12px;color:var(--text-lo);line-height:1.5;}
  .topics-head .close-btn{background:none;border:none;color:var(--text-lo);cursor:pointer;padding:5px;border-radius:6px;flex:none;}
  .topics-head .close-btn:hover{color:var(--text-hi);background:var(--bg-2);}
  .topics-search-row{padding:12px 22px 0;flex:none;}
  .topics-search-row input{width:100%;background:var(--bg-2);border:1px solid var(--line);color:var(--text-hi);font-family:'Inter',sans-serif;font-size:13px;padding:9px 12px;border-radius:9px;outline:none;transition:border-color .15s;}
  .topics-search-row input:focus{border-color:#4a4a4a;}
  .topics-body{overflow-y:auto;padding:14px 22px 6px;flex:1;}
  .topics-vol{margin-bottom:6px;border:1px solid var(--line-soft);border-radius:10px;overflow:hidden;}
  .topics-vol-head{display:flex;align-items:center;gap:10px;width:100%;background:var(--bg-2);border:none;color:var(--text-hi);padding:11px 13px;cursor:pointer;text-align:left;transition:background .13s;}
  .topics-vol-head:hover{background:#242424;}
  .topics-vol-head .vnum{font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:var(--cfa);background:var(--cfa-glow);border:1px solid rgba(224,185,84,.3);border-radius:6px;padding:2px 7px;flex:none;}
  .topics-vol-head .vtitle{font-family:'Inter',sans-serif;font-size:13px;font-weight:600;flex:1;min-width:0;}
  .topics-vol-head .vcount{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text-faint);flex:none;}
  .topics-vol-head .vchev{flex:none;color:var(--text-lo);transition:transform .15s;}
  .topics-vol.open .vchev{transform:rotate(90deg);}
  .topics-mod-list{display:none;flex-direction:column;padding:4px;gap:2px;background:var(--bg-0);}
  .topics-vol.open .topics-mod-list{display:flex;}
  .topics-mod-wrap{display:flex;flex-direction:column;}
  .topics-mod-row{display:flex;align-items:stretch;gap:2px;border-radius:7px;overflow:hidden;}
  .topics-mod-item{flex:1;display:flex;align-items:center;gap:9px;background:none;border:none;color:var(--text-mid);font-family:'Inter',sans-serif;font-size:12.5px;padding:8px 6px 8px 10px;cursor:pointer;text-align:left;transition:background .12s,color .12s;min-width:0;}
  .topics-mod-item:hover{background:var(--bg-1);color:var(--text-hi);}
  .topics-mod-item .mnum{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text-faint);flex:none;width:20px;text-align:right;}
  .topics-mod-item .mtitle{flex:1;min-width:0;}
  .topics-mod-item .marrow{flex:none;opacity:0;color:var(--cfa);transition:opacity .12s,transform .12s;transform:translateX(-3px);}
  .topics-mod-item:hover .marrow{opacity:1;transform:translateX(0);}
  .topics-mod-expand{flex:none;width:30px;background:none;border:none;color:var(--text-faint);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .12s,color .12s;border-radius:7px;}
  .topics-mod-expand:hover{background:var(--bg-1);color:var(--text-hi);}
  .topics-mod-expand svg{transition:transform .15s;}
  .topics-mod-wrap.open .topics-mod-expand svg{transform:rotate(90deg);}
  .topics-sub-list{display:none;flex-direction:column;padding:2px 4px 4px 40px;gap:1px;}
  .topics-mod-wrap.open .topics-sub-list{display:flex;}
  .topics-sub-item{display:flex;align-items:center;gap:8px;background:none;border:none;color:var(--text-faint);font-family:'Inter',sans-serif;font-size:11.5px;padding:6px 8px;border-radius:6px;cursor:pointer;text-align:left;transition:background .12s,color .12s;}
  .topics-sub-item:hover{background:var(--bg-1);color:var(--text-hi);}
  .topics-sub-item .sdash{flex:none;color:var(--text-faint);opacity:.6;}
  .topics-sub-item .stitle{flex:1;min-width:0;}
  .topics-sub-item .sarrow{flex:none;opacity:0;color:var(--cfa);transition:opacity .12s,transform .12s;transform:translateX(-3px);}
  .topics-sub-item:hover .sarrow{opacity:1;transform:translateX(0);}
  .topics-sub-empty{padding:6px 8px 8px 40px;font-size:11px;color:var(--text-faint);font-style:italic;}
  .topics-empty{color:var(--text-faint);font-size:12.5px;padding:24px 6px;text-align:center;}
  .topics-foot{padding:12px 22px 16px;border-top:1px solid var(--line-soft);flex:none;display:flex;align-items:center;justify-content:space-between;gap:10px;}
  .topics-foot .tleft{font-size:11px;color:var(--text-faint);font-family:'IBM Plex Mono',monospace;}
  .topics-foot .tright{display:flex;gap:8px;}
  .topics-depth-select{background:var(--bg-2);border:1px solid var(--line);color:var(--text-hi);font-family:'Inter',sans-serif;font-size:12px;padding:7px 10px;border-radius:8px;outline:none;cursor:pointer;}

  /* ============ SIDE CHAT — a small independent scratch conversation next to the main thread,
     for asking a quick clarifying question without derailing the main chat ============ */
  .body-row{flex:1;display:flex;min-height:0;position:relative;}
  .thread-col{flex:1;display:flex;flex-direction:column;min-width:340px;min-height:0;}

  .side-panel{width:0;flex:none;overflow:hidden;display:flex;flex-direction:column;border-left:1px solid var(--line);background:var(--bg-0);transition:width .2s ease;}
  .side-panel.open{width:min(300px,32vw);}
  @media (max-width:1100px){
    .side-panel.open{width:min(280px,38vw);}
  }
  @media (max-width:880px){
    .side-panel{position:fixed;top:0;right:0;bottom:0;width:0;z-index:30;box-shadow:-14px 0 34px rgba(0,0,0,.45);}
    .side-panel.open{width:min(320px,82vw);}
  }
  .side-scrim{display:none;position:fixed;inset:0;background:rgba(0,0,0,.25);z-index:29;}
  .side-scrim.show{display:block;}
  @media (min-width:881px){.side-scrim{display:none !important;}}

  .side-panel-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:13px 14px;border-bottom:1px solid var(--line-soft);flex:none;}
  .side-panel-head .stitle{display:flex;align-items:center;gap:7px;font-family:'Inter',sans-serif;font-size:12.5px;font-weight:600;color:var(--text-hi);white-space:nowrap;}
  .side-panel-head .stitle::before{content:'';width:5px;height:5px;border-radius:50%;flex:none;background:var(--text-faint);}
  .side-panel-head .side-actions{display:flex;align-items:center;gap:2px;}

  .side-thread{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:16px;}
  .side-empty{color:var(--text-lo);font-size:12px;line-height:1.65;padding:2px;}
  .side-msg{display:flex;flex-direction:column;max-width:100%;}
  .side-msg .role-label{font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
  .side-msg.user .role-label{
    background:linear-gradient(90deg,var(--nvidia) 0%,var(--openrouter) 100%);
    -webkit-background-clip:text;
    background-clip:text;
    color:transparent;
    -webkit-text-fill-color:transparent;
    font-weight:600;
  }
  .side-msg.assistant .role-label{color:var(--openrouter);}
  .side-msg .bubble{font-size:13px;line-height:1.58;}
  .side-msg.user .bubble{
    padding-left:10px;
    border-left:2px solid var(--nvidia);
    font-weight:500;
    background:linear-gradient(90deg,var(--nvidia) 0%,var(--openrouter) 100%);
    -webkit-background-clip:text;
    background-clip:text;
    color:transparent;
    -webkit-text-fill-color:transparent;
  }
  .side-msg.assistant .bubble{color:var(--text-hi);}
  .side-msg .bubble p{margin:0 0 8px;}
  .side-msg .bubble p:last-child{margin-bottom:0;}
  .side-msg .bubble pre{background:var(--bg-2);border:1px solid var(--line-soft);border-radius:8px;padding:9px 10px;overflow-x:auto;margin:6px 0;}
  .side-msg .bubble pre code{background:none;padding:0;font-size:12px;line-height:1.5;color:var(--text-mid);}
  .side-msg .bubble code{font-family:'IBM Plex Mono',monospace;font-size:12px;background:var(--bg-2);padding:1px 5px;border-radius:4px;color:var(--text-mid);}

  .side-composer{padding:12px 12px 14px;flex:none;}
  .side-composer-box{display:flex;align-items:flex-end;gap:8px;background:var(--bg-2);border:1px solid var(--line);border-radius:18px;padding:8px 8px 8px 14px;transition:border-color .15s;}
  .side-composer-box:focus-within{border-color:#4a4a4a;}
  .side-composer textarea{flex:1;background:none;border:none;outline:none;resize:none;color:var(--text-hi);font-family:'Inter',sans-serif;font-size:13px;line-height:1.5;max-height:110px;padding:5px 0;}
  .side-composer textarea::placeholder{color:var(--text-faint);}
  .side-send-btn{background:var(--bg-3);border:none;color:var(--text-mid);width:26px;height:26px;border-radius:50%;cursor:pointer;flex:none;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s;}
  .side-send-btn:hover:not(:disabled){color:var(--text-hi);background:#3a3a3a;}
  .side-send-btn:disabled{opacity:.35;cursor:not-allowed;}


  .branch-switch{display:flex;align-items:center;gap:4px;margin-top:8px;}
  .branch-nav{background:var(--bg-1);border:1px solid var(--line);color:var(--text-mid);width:22px;height:22px;border-radius:6px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:border-color .15s,color .15s;}
  .branch-nav:hover:not(:disabled){color:var(--text-hi);border-color:var(--text-lo);}
  .branch-nav:disabled{opacity:.3;cursor:not-allowed;}
  .branch-label{font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:var(--text-faint);min-width:32px;text-align:center;}

  .branch-new-btn{display:inline-flex;align-items:center;gap:5px;margin-top:10px;background:none;border:1px solid var(--line);color:var(--text-faint);font-family:'Inter',sans-serif;font-size:11.5px;font-weight:500;padding:5px 10px;border-radius:14px;cursor:pointer;transition:border-color .15s,color .15s,background .15s;opacity:0;}
  .msg.assistant:hover .branch-new-btn{opacity:1;}
  .branch-new-btn:hover{color:var(--text-hi);border-color:var(--text-lo);background:var(--bg-1);}

  .stream-caret{display:inline-block;width:2px;height:1em;background:var(--text-hi);vertical-align:text-bottom;margin-left:1px;animation:caretblink 1s step-end infinite;}
  @keyframes caretblink{0%,100%{opacity:1;}50%{opacity:0;}}

  .thread{flex:1;overflow-y:auto;padding:0 20px 16px;}
  .thread-inner{max-width:720px;width:100%;margin:0 auto;display:flex;flex-direction:column;gap:0;min-height:100%;padding-top:24px;}

  .empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:4px;padding:20px 0;}
  .empty-diagram{width:min(360px,84vw);height:120px;margin-bottom:10px;}
  .empty h2{font-family:'Inter',sans-serif;font-size:26px;font-weight:600;margin:2px 0 8px;letter-spacing:-.02em;}
  .empty p{margin:0;font-size:14px;color:var(--text-mid);max-width:380px;line-height:1.65;}
  .suggestions{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:22px;max-width:520px;}
  .chip{font-family:'Inter',sans-serif;font-size:12.5px;color:var(--text-mid);background:var(--bg-1);border:1px solid var(--line);padding:9px 14px;border-radius:20px;cursor:pointer;transition:border-color .15s,color .15s,background .15s;}
  .chip:hover{border-color:var(--text-lo);color:var(--text-hi);background:var(--bg-2);}
  .chip.cfa-chip{border-color:rgba(224,185,84,.3);color:var(--cfa);background:var(--cfa-glow);}
  .chip.cfa-chip:hover{border-color:var(--cfa-dim);}

  /* Exact reference style: bare flowing text, no avatar, no bubble, no background, no border */
  .msg{display:block;animation:rise .22s ease both;padding:14px 0;}
  @keyframes rise{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}}
  .avatar{display:none;}

  .bubble-wrap{display:flex;flex-direction:column;gap:6px;max-width:100%;flex:1;}
  .bubble{padding:0;border-radius:0;font-size:15px;line-height:1.72;word-wrap:break-word;color:var(--text-hi);}
  .msg.user .bubble{background:none;color:var(--text-hi);white-space:pre-wrap;font-weight:400;}
  .msg.assistant .bubble{background:none;border:none;color:var(--text-hi);}
  .bubble p{margin:0 0 14px;}
  .bubble p:last-child{margin-bottom:0;}
  .bubble code{font-family:'IBM Plex Mono',monospace;background:var(--bg-2);padding:2px 6px;border-radius:4px;font-size:.86em;border:1px solid var(--line-soft);}
  .bubble pre{background:#0a0a0a;border:1px solid var(--line);padding:14px 16px;border-radius:10px;overflow-x:auto;margin:10px 0;}
  .bubble pre code{background:none;padding:0;border:none;}
  .bubble strong{color:var(--text-hi);font-weight:700;}
  .bubble h1,.bubble h2,.bubble h3{font-family:'Inter',sans-serif;font-weight:600;margin:20px 0 10px;line-height:1.35;letter-spacing:-.01em;}
  .bubble h1{font-size:1.3em;}.bubble h2{font-size:1.15em;}.bubble h3{font-size:1.04em;}
  .bubble ul,.bubble ol{margin:0 0 14px;padding-left:22px;}
  .bubble li{margin-bottom:6px;}
  .bubble hr{border:none;border-top:1px solid var(--line);margin:18px 0;}
  .bubble .katex{font-size:1.03em;}
  .bubble .katex-display{margin:14px 0;overflow-x:auto;overflow-y:hidden;}
  .table-scroll{overflow-x:auto;margin:10px 0;border:1px solid var(--line);border-radius:10px;}
  .bubble table{border-collapse:collapse;width:100%;font-size:.93em;}
  .bubble table th,.bubble table td{padding:10px 14px;text-align:left;border-bottom:1px solid var(--line-soft);white-space:nowrap;}
  .bubble table th{font-family:'Inter',sans-serif;font-size:.85em;font-weight:600;color:var(--text-hi);background:var(--bg-1);}
  .bubble table tr:last-child td{border-bottom:none;}
  .bubble table td:first-child,.bubble table th:first-child{font-weight:500;color:var(--text-hi);}

  .meta-line{font-size:10.5px;color:var(--text-faint);font-family:'IBM Plex Mono',monospace;padding:0;}
  .typing{display:flex;gap:4px;padding:6px 2px;}
  .typing span{width:6px;height:6px;border-radius:50%;background:var(--text-lo);animation:blink 1.2s infinite ease-in-out;}
  .typing span:nth-child(2){animation-delay:.18s;}
  .typing span:nth-child(3){animation-delay:.36s;}
  @keyframes blink{0%,80%,100%{opacity:.25;transform:scale(.85);}40%{opacity:1;transform:scale(1);}}
  .error-bubble{color:#ff9d9f !important;}

  .composer{border-top:none;padding:8px 20px 22px;background:linear-gradient(180deg,rgba(13,13,13,0),var(--bg-0) 40%);}
  .composer-inner{max-width:720px;margin:0 auto;}
  .composer-box{display:flex;align-items:flex-end;gap:10px;background:var(--bg-2);border:1px solid var(--line);border-radius:24px;padding:10px 10px 10px 18px;transition:border-color .15s,box-shadow .15s;}
  .composer-box:focus-within{border-color:#4a4a4a;box-shadow:0 0 0 1px rgba(255,255,255,.04);}
  textarea#messageInput{flex:1;background:none;border:none;outline:none;resize:none;color:var(--text-hi);font-family:'Inter',sans-serif;font-size:15px;line-height:1.5;max-height:180px;padding:6px 0;}
  textarea#messageInput::placeholder{color:var(--text-lo);}
  .send-btn{flex:none;width:34px;height:34px;border-radius:50%;border:none;cursor:pointer;background:var(--text-hi);color:#0d0d0d;display:flex;align-items:center;justify-content:center;transition:transform .12s,opacity .15s,background .15s;}
  .send-btn[data-provider="openrouter"]{background:var(--text-hi);color:#0d0d0d;}
  .send-btn:hover:not(:disabled){transform:scale(1.05);}
  .send-btn:disabled{opacity:.3;cursor:not-allowed;}
  .composer-foot{display:flex;justify-content:space-between;margin-top:9px;padding:0 8px;}
  .composer-foot span{font-size:11px;color:var(--text-faint);font-family:'Inter',sans-serif;}

  .toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--bg-2);border:1px solid var(--line);color:var(--text-hi);padding:11px 18px;border-radius:10px;font-size:12.5px;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:80;box-shadow:0 14px 34px rgba(0,0,0,.5);}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
  .toast.err{border-color:rgba(242,85,90,.4);color:#ff9d9f;}

  /* ============ SETTINGS MODAL ============ */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(3px);z-index:70;display:none;align-items:center;justify-content:center;padding:24px;}
  .modal-overlay.show{display:flex;}
  .modal{width:100%;max-width:600px;max-height:88vh;background:var(--bg-1);border:1px solid var(--line);border-radius:16px;display:flex;flex-direction:column;box-shadow:0 30px 80px rgba(0,0,0,.6);animation:modal-in .18s ease;}
  @keyframes modal-in{from{opacity:0;transform:translateY(8px) scale(.99);}to{opacity:1;transform:translateY(0) scale(1);}}
  .modal-head{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--line-soft);}
  .modal-head h2{font-family:'Inter',sans-serif;font-size:16px;font-weight:600;margin:0;display:flex;align-items:center;gap:9px;}
  .modal-head .close-btn{background:none;border:none;color:var(--text-lo);cursor:pointer;padding:5px;border-radius:6px;}
  .modal-head .close-btn:hover{color:var(--text-hi);background:var(--bg-2);}
  .modal-tabs{display:flex;gap:2px;padding:0 22px;border-bottom:1px solid var(--line-soft);}
  .modal-tab{background:none;border:none;color:var(--text-faint);font-size:12.5px;font-weight:500;padding:11px 4px;margin-right:20px;cursor:pointer;position:relative;border-bottom:2px solid transparent;transition:color .15s;}
  .modal-tab:hover{color:var(--text-mid);}
  .modal-tab.active{color:var(--text-hi);border-bottom-color:var(--text-hi);}
  .modal-body{padding:20px 22px 22px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:18px;}
  .modal-pane{display:none;flex-direction:column;gap:18px;}
  .modal-pane.active{display:flex;}
  .field-label{font-size:12.5px;font-weight:500;color:var(--text-hi);}
  .field-desc{font-size:11.5px;color:var(--text-faint);line-height:1.55;margin:2px 0 0;}
  input[type="text"],input[type="password"],select,textarea.field{width:100%;background:var(--bg-2);border:1px solid var(--line);color:var(--text-hi);font-family:'IBM Plex Mono',monospace;font-size:12.5px;padding:10px 12px;border-radius:8px;outline:none;transition:border-color .15s,box-shadow .15s;}
  input::placeholder,textarea::placeholder{color:var(--text-faint);}
  input:focus,select:focus,textarea.field:focus{border-color:#4a4a4a;box-shadow:0 0 0 3px rgba(255,255,255,.04);}
  textarea.field{resize:vertical;font-family:'Inter',sans-serif;font-size:13px;line-height:1.55;min-height:70px;}
  .key-row{position:relative;}
  .key-row .visibility{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-lo);cursor:pointer;padding:4px 6px;font-size:10px;font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:.04em;border-radius:4px;}
  .key-row .visibility:hover{color:var(--text-mid);background:var(--bg-3);}

  .provider-switch{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .provider-card{position:relative;background:var(--bg-2);border:1px solid var(--line);border-radius:10px;padding:11px 12px;cursor:pointer;text-align:left;transition:border-color .18s,background .18s,transform .12s;}
  .provider-card:hover{transform:translateY(-1px);}
  .provider-card .pname{font-family:'Inter',sans-serif;font-size:12.5px;font-weight:600;color:var(--text-mid);display:flex;align-items:center;gap:6px;}
  .provider-card .pdot{width:6px;height:6px;border-radius:50%;background:var(--text-lo);}
  .provider-card .psub{font-size:10px;color:var(--text-faint);margin-top:4px;font-family:'IBM Plex Mono',monospace;}
  .provider-card[data-p="nvidia"].active{border-color:rgba(16,163,127,.45);background:linear-gradient(160deg,var(--nvidia-glow),var(--bg-2) 65%);}
  .provider-card[data-p="nvidia"].active .pname{color:var(--nvidia);}
  .provider-card[data-p="nvidia"].active .pdot{background:var(--nvidia);box-shadow:0 0 8px var(--nvidia);}
  .provider-card[data-p="openrouter"].active{border-color:rgba(171,104,255,.45);background:linear-gradient(160deg,var(--openrouter-glow),var(--bg-2) 65%);}
  .provider-card[data-p="openrouter"].active .pname{color:var(--openrouter);}
  .provider-card[data-p="openrouter"].active .pdot{background:var(--openrouter);box-shadow:0 0 8px var(--openrouter);}

  .inline-msg{display:flex;gap:8px;align-items:flex-start;font-size:11.5px;line-height:1.55;padding:9px 11px;border-radius:8px;border:1px solid;}
  .inline-msg.warn{color:var(--warn);border-color:rgba(232,176,75,.35);background:rgba(232,176,75,.08);}
  .inline-msg.ok{color:var(--nvidia);border-color:rgba(16,163,127,.3);background:var(--nvidia-glow);}
  .inline-msg svg{flex:none;margin-top:1px;}
  .field-desc a{color:var(--nvidia);text-decoration:none;}
  .field-desc a:hover{text-decoration:underline;}
  .field-desc b{color:var(--text-mid);}

  .model-chips{display:flex;flex-wrap:wrap;gap:7px;}
  .model-chip{display:flex;align-items:center;gap:7px;background:var(--bg-2);border:1px solid var(--line);color:var(--text-mid);font-family:'IBM Plex Mono',monospace;font-size:11px;padding:7px 6px 7px 11px;border-radius:7px;cursor:pointer;transition:border-color .15s,color .15s;}
  .model-chip:hover{border-color:var(--text-lo);color:var(--text-hi);}
  .model-chip.active{border-color:var(--nvidia-dim);color:var(--nvidia);background:var(--nvidia-glow);}
  .model-chip .mx{background:none;border:none;color:inherit;opacity:.55;cursor:pointer;padding:2px 4px;font-size:12px;line-height:1;}
  .model-chip .mx:hover{opacity:1;}
  .model-input-row{display:flex;gap:8px;}
  .model-input-row input{flex:1;}
  .pin-btn{flex:none;background:var(--bg-2);border:1px solid var(--line);color:var(--text-mid);width:38px;border-radius:8px;cursor:pointer;font-size:14px;}
  .pin-btn:hover{color:var(--text-hi);border-color:var(--text-lo);}

  .theme-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .theme-swatch{border:1px solid var(--line);border-radius:10px;padding:12px;cursor:pointer;display:flex;flex-direction:column;gap:8px;transition:border-color .15s;}
  .theme-swatch:hover{border-color:var(--text-lo);}
  .theme-swatch.active{border-color:var(--text-hi);}
  .swatch-bar{display:flex;gap:4px;}
  .swatch-dot{width:16px;height:16px;border-radius:50%;}
  .theme-swatch .tname{font-size:12px;color:var(--text-mid);}

  .toggle-row{display:flex;align-items:center;justify-content:space-between;gap:12px;}
  .toggle-row .trow-label{font-size:12.5px;color:var(--text-hi);}
  .toggle-row .trow-desc{font-size:11px;color:var(--text-faint);margin-top:2px;}
  .switch{position:relative;width:38px;height:22px;flex:none;}
  .switch input{opacity:0;width:0;height:0;}
  .switch-track{position:absolute;inset:0;background:var(--bg-3);border-radius:20px;cursor:pointer;transition:background .18s;}
  .switch-track::before{content:'';position:absolute;width:16px;height:16px;left:3px;top:3px;background:var(--text-mid);border-radius:50%;transition:transform .18s,background .18s;}
  .switch input:checked + .switch-track{background:var(--nvidia-dim);}
  .switch input:checked + .switch-track::before{transform:translateX(16px);background:#fff;}

  .danger-zone{border:1px solid rgba(242,85,90,.3);background:rgba(242,85,90,.05);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:10px;}
  .danger-zone .dz-row{display:flex;align-items:center;justify-content:space-between;gap:12px;}
  .danger-zone .dz-label{font-size:12.5px;color:var(--text-hi);}
  .danger-zone .dz-desc{font-size:11px;color:var(--text-faint);margin-top:2px;}
  .danger-btn{background:none;border:1px solid rgba(242,85,90,.4);color:var(--danger);font-size:11.5px;font-weight:500;padding:7px 12px;border-radius:7px;cursor:pointer;flex:none;transition:background .15s;}
  .danger-btn:hover{background:rgba(242,85,90,.12);}
  .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .stat-box{background:var(--bg-2);border:1px solid var(--line);border-radius:9px;padding:12px 14px;}
  .stat-box .snum{font-family:'Inter',sans-serif;font-size:22px;font-weight:700;}
  .stat-box .slabel{font-size:10.5px;color:var(--text-faint);font-family:'Inter',sans-serif;text-transform:uppercase;letter-spacing:.05em;margin-top:2px;}

  .modal-actions{display:flex;justify-content:flex-end;gap:10px;padding:16px 22px;border-top:1px solid var(--line-soft);}
  .btn-secondary{background:none;border:1px solid var(--line);color:var(--text-mid);font-size:12.5px;font-weight:500;padding:9px 16px;border-radius:20px;cursor:pointer;transition:border-color .15s,color .15s;}
  .btn-secondary:hover{border-color:var(--text-lo);color:var(--text-hi);}
  .btn-primary{background:var(--text-hi);color:#0d0d0d;border:none;font-size:12.5px;font-weight:600;padding:9px 18px;border-radius:20px;cursor:pointer;transition:transform .12s,opacity .15s;}
  .btn-primary:hover{transform:translateY(-1px);}
  .btn-primary[data-provider="openrouter"]{background:var(--text-hi);color:#0d0d0d;}

  button:focus-visible,input:focus-visible,.chip:focus-visible,.provider-card:focus-visible,.convo-item:focus-visible{outline:2px solid var(--nvidia);outline-offset:2px;}
  textarea:focus-visible{outline:none;}

  [data-theme="graphite"] body{--paper:#131313;--bg-0:#131313;}
  body.compact .msg{padding:12px 0;}
  body.compact .bubble{font-size:14px;}
</style>
</head>
<body>

<div class="scrim" id="scrim"></div>

<div class="shell">
  <!-- SIDEBAR — icon rail only: new chat + settings -->
  <aside class="sidebar" id="sidebar">
    <div class="brand-row">
      <div class="brand">
        <svg class="brand-mark" viewBox="0 0 40 40" fill="none">
          <path d="M20 20L7 8M20 20L7 32M20 20L33 8M20 20L33 32" stroke="#3a3a3a" stroke-width="1.6"/>
          <circle cx="20" cy="20" r="3.2" fill="#ececec"/>
          <circle cx="7" cy="8" r="2.4" fill="#10a37f"/><circle cx="7" cy="32" r="2.4" fill="#10a37f"/>
          <circle cx="33" cy="8" r="2.4" fill="#ab68ff"/><circle cx="33" cy="32" r="2.4" fill="#ab68ff"/>
        </svg>
      </div>
    </div>

    <button type="button" class="rail-icon-btn" id="newChatBtn" data-provider="nvidia" aria-label="New chat" title="New chat">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>

    <button type="button" class="rail-icon-btn" id="topicsBtn" aria-label="Browse CFA topics" title="Browse CFA topics">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V4a2 2 0 00-2-2H6.5A2.5 2.5 0 004 4.5v15z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>

    <div class="rail-spacer"></div>

    <button type="button" class="rail-icon-btn" id="settingsBtn" aria-label="Settings" title="Settings">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9A1.65 1.65 0 0010 3.09V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="1.8"/></svg>
    </button>

    <!-- hidden search input kept for JS compatibility (search feature no longer shown in UI) -->
    <input type="text" id="searchInput" style="display:none;">
    <div id="convoList" style="display:none;"></div>
  </aside>

  <!-- MAIN -->
  <div class="main">
    <div class="topbar">
      <div class="spacer"></div>
      <button type="button" class="topics-toggle" id="topicsToggle" title="Browse the CFA Level I curriculum and request a detailed explanation of any module">
        <span class="tdot"></span>
        Topics
      </button>
      <button type="button" class="side-toggle" id="dualToggle" title="Open a side chat — quick, unrelated questions with no memory, without derailing this conversation">
        <span class="ddot"></span>
        Side chat
      </button>
      <button type="button" class="modes-toggle" id="modesToggle" title="Response modes — layer extra behaviors onto every answer">
        <span class="mdot"></span>
        <span id="modesLabel">Modes</span>
        <span class="mcount" id="modesCount" style="display:none;">0</span>
      </button>
    </div>

    <div class="body-row" id="bodyRow">
    <div class="thread-col">
    <div class="thread" id="thread">
      <div class="thread-inner" id="threadInner">
        <div class="empty" id="emptyState">
          <svg class="empty-diagram" viewBox="0 0 420 150" fill="none">
            <path d="M40 75 C 130 75, 130 34, 210 34 S 290 75, 380 34" stroke="#212121" stroke-width="1.4" fill="none"/>
            <path d="M40 75 C 130 75, 130 116, 210 116 S 290 75, 380 116" stroke="#212121" stroke-width="1.4" fill="none"/>
            <path id="pulseTop" d="M40 75 C 130 75, 130 34, 210 34 S 290 75, 380 34" stroke="#10a37f" stroke-width="1.6" fill="none" opacity=".85"/>
            <path id="pulseBottom" d="M40 75 C 130 75, 130 116, 210 116 S 290 75, 380 116" stroke="#ab68ff" stroke-width="1.6" fill="none" opacity=".18"/>
            <circle cx="40" cy="75" r="5" fill="#ececec"/>
            <text x="40" y="100" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#676767">you</text>
            <circle cx="380" cy="34" r="5" fill="#10a37f"/>
            <text x="380" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#10a37f">nvidia</text>
            <circle cx="380" cy="116" r="5" fill="#ab68ff"/>
            <text x="380" y="140" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#ab68ff">openrouter</text>
            <circle cx="210" cy="75" r="7" fill="none" stroke="#ececec" stroke-width="1.4"/>
            <circle cx="210" cy="75" r="2.2" fill="#ececec"/>
          </svg>
          <h2 class="display">Where to route this?</h2>
          <p>Pick a provider in Settings, drop in a key, and send. Every message travels straight through your own <code class="mono" style="color:var(--text-mid);">/api/chat</code> function.</p>
          <div class="suggestions">
            <button class="chip cfa-chip" id="browseTopicsChip">browse CFA topics</button>
            <button class="chip" data-fill="Give me a few ideas for a weekend trip.">weekend trip ideas</button>
            <button class="chip" data-fill="Help me write a thank-you note.">write a thank-you note</button>
          </div>
        </div>
      </div>
    </div>

    <div class="composer">
      <div class="composer-inner">
        <div class="composer-box">
          <textarea id="messageInput" rows="1" placeholder="Message Nexus…"></textarea>
          <button class="send-btn" id="sendBtn" data-provider="nvidia" aria-label="Send message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
    </div>

    <div class="side-panel" id="sidePanel">
      <div class="side-panel-head">
        <span class="stitle">Side chat</span>
        <div class="side-actions">
          <button type="button" class="icon-btn" id="sideClearBtn" title="Clear side chat" aria-label="Clear side chat">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button type="button" class="icon-btn" id="sideCloseBtn" title="Close side chat" aria-label="Close side chat">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
      <div class="side-thread" id="sideThread">
        <div class="side-empty" id="sideEmpty">Ask a quick, unrelated side question here — like "what does that term mean?" — without adding it to the main conversation. Each side-chat message is answered fresh, with no memory of earlier side-chat turns or the main conversation.</div>
      </div>
      <div class="side-composer">
        <div class="side-composer-box">
          <textarea id="sideMessageInput" rows="1" placeholder="Ask a side question…"></textarea>
          <button type="button" class="side-send-btn" id="sideSendBtn" aria-label="Send side question">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
    </div>
  </div>
</div>
<div class="side-scrim" id="sideScrim"></div>

<!-- SETTINGS MODAL -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <div class="modal-head">
      <h2>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9A1.65 1.65 0 0010 3.09V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="1.8"/></svg>
        Settings
      </h2>
      <button class="close-btn" id="modalClose" aria-label="Close settings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="modal-tabs">
      <button class="modal-tab active" data-tab="general">General</button>
      <button class="modal-tab" data-tab="prompts">Prompts</button>
      <button class="modal-tab" data-tab="appearance">Appearance</button>
      <button class="modal-tab" data-tab="data">Data</button>
    </div>
    <div class="modal-body">

      <!-- GENERAL -->
      <div class="modal-pane active" id="pane-general">
        <div>
          <div class="field-label">Provider</div>
          <p class="field-desc">Switch anytime — each provider keeps its own key and model list, so switching back and forth doesn't lose either one.</p>
          <div class="provider-switch" id="providerToggle" style="margin-top:10px;">
            <button type="button" class="provider-card active" data-p="nvidia">
              <div class="pname"><span class="pdot"></span>NVIDIA</div>
              <div class="psub">NIM · integrate.api</div>
            </button>
            <button type="button" class="provider-card" data-p="openrouter">
              <div class="pname"><span class="pdot"></span>OpenRouter</div>
              <div class="psub">multi-model gateway</div>
            </button>
          </div>
        </div>

        <div>
          <div class="field-label" id="keyLabel">NVIDIA NIM API key</div>
          <div class="key-row" style="margin-top:8px;">
            <input type="password" id="apiKeyInput" class="mono" placeholder="nvapi-••••••••••••••••" spellcheck="false" autocomplete="off">
            <button type="button" class="visibility" id="toggleKeyVis">show</button>
          </div>
          <div id="keyValidationMsg"></div>
          <p class="field-desc" id="keyDesc">Required. Get a free key at <a href="https://build.nvidia.com" target="_blank" rel="noopener">build.nvidia.com</a> — open any model card and click "Get API Key." You can also paste a whole Python/LangChain code snippet here (like the one on a model's page) and it'll pull out the key and model automatically. Stored only in this browser's localStorage and relayed through this site's own backend function, never logged or stored anywhere. <b>You must click "Save changes" below for the key to take effect</b> — closing this panel any other way discards unsaved changes.</p>
        </div>

        <div>
          <div class="field-label">Active model</div>
          <div class="model-input-row" style="margin-top:8px;">
            <input type="text" id="modelInput" class="mono" placeholder="meta/llama-3.1-8b-instruct" spellcheck="false">
            <button type="button" class="pin-btn" id="pinModelBtn" title="Save this model">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            </button>
          </div>
          <p class="field-desc" id="modelDesc">Smaller/lighter models are more likely to drop spaces or characters on long structured output like tables and figures. For reliable structured output, prefer a larger instruct model — browse the current catalog and exact model IDs at <a href="https://build.nvidia.com" target="_blank" rel="noopener">build.nvidia.com</a>.</p>
        </div>

        <div>
          <div class="field-label">Saved models <span style="color:var(--text-faint);font-weight:400;">(click to use, × to remove)</span></div>
          <div class="model-chips" id="modelChips" style="margin-top:9px;"></div>
        </div>
      </div>

      <!-- PROMPTS -->
      <div class="modal-pane" id="pane-prompts">
        <div>
          <div class="field-label">System prompt</div>
          <p class="field-desc">Applied to every new message in this conversation. Leave blank for default behavior.</p>
          <textarea id="systemPrompt" class="field mono" rows="5" style="margin-top:8px;" placeholder="You are a precise, concise assistant…"></textarea>
        </div>
        <div>
          <div class="field-label">Quick-insert prompts</div>
          <p class="field-desc">Saved snippets you can drop into the composer. Manage them here.</p>
          <div id="promptChips" class="model-chips" style="margin-top:9px;"></div>
          <div class="model-input-row" style="margin-top:10px;">
            <input type="text" id="newPromptInput" placeholder="e.g. Explain like I'm five:" style="font-family:'Inter',sans-serif;">
            <button type="button" class="pin-btn" id="addPromptBtn">+</button>
          </div>
        </div>
      </div>

      <!-- APPEARANCE -->
      <div class="modal-pane" id="pane-appearance">
        <div>
          <div class="field-label">Theme</div>
          <p class="field-desc">Nexus is dark-first. Both options keep contrast accessible.</p>
          <div class="theme-grid" style="margin-top:10px;">
            <div class="theme-swatch active" data-theme="ink" id="themeInk">
              <div class="swatch-bar"><div class="swatch-dot" style="background:#0d0d0d;border:1px solid #2a2a2a;"></div><div class="swatch-dot" style="background:#10a37f;"></div><div class="swatch-dot" style="background:#ab68ff;"></div></div>
              <div class="tname">Ink (default)</div>
            </div>
            <div class="theme-swatch" data-theme="graphite" id="themeGraphite">
              <div class="swatch-bar"><div class="swatch-dot" style="background:#131313;border:1px solid #2f2f2f;"></div><div class="swatch-dot" style="background:#10a37f;"></div><div class="swatch-dot" style="background:#ab68ff;"></div></div>
              <div class="tname">Graphite</div>
            </div>
          </div>
        </div>
        <div class="toggle-row">
          <div>
            <div class="trow-label">Compact messages</div>
            <div class="trow-desc">Tighter spacing and smaller bubbles in the thread.</div>
          </div>
          <label class="switch"><input type="checkbox" id="compactToggle"><span class="switch-track"></span></label>
        </div>
        <div class="toggle-row">
          <div>
            <div class="trow-label">Route pulse animation</div>
            <div class="trow-desc">Animate the signal path on the empty-state diagram.</div>
          </div>
          <label class="switch"><input type="checkbox" id="pulseToggle" checked><span class="switch-track"></span></label>
        </div>
      </div>

      <!-- DATA -->
      <div class="modal-pane" id="pane-data">
        <div class="stat-grid">
          <div class="stat-box"><div class="snum mono" id="statConvos">0</div><div class="slabel">conversations</div></div>
          <div class="stat-box"><div class="snum mono" id="statMsgs">0</div><div class="slabel">messages stored</div></div>
        </div>
        <div class="inline-msg ok">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="flex:none;"><path d="M12 2L2 7V12C2 16.5 6 20.5 12 22C18 20.5 22 16.5 22 12V7L12 2Z" stroke="currentColor" stroke-width="1.6"/></svg>
          <span>API keys, models, and conversation history all live in this browser's localStorage. Nothing is sent to a third party except the provider you've selected, via your own <code class="mono" style="background:none;padding:0;">/api/chat</code> function.</span>
        </div>
        <div class="danger-zone">
          <div class="dz-row">
            <div><div class="dz-label">Clear all conversations</div><div class="dz-desc">Deletes every saved chat. Keys and settings are kept.</div></div>
            <button type="button" class="danger-btn" id="clearConvosBtn">Clear chats</button>
          </div>
          <div class="dz-row">
            <div><div class="dz-label">Reset Nexus completely</div><div class="dz-desc">Wipes conversations, keys, models, and preferences.</div></div>
            <button type="button" class="danger-btn" id="resetAllBtn">Reset everything</button>
          </div>
        </div>
      </div>

    </div>
    <div class="modal-actions">
      <button type="button" class="btn-secondary" id="modalCancel">Cancel</button>
      <button type="button" class="btn-primary" id="modalSave" data-provider="nvidia">Save changes</button>
    </div>
  </div>
</div>

<!-- MODES MODAL -->
<div class="modes-overlay" id="modesOverlay">
  <div class="modes-modal">
    <div class="modes-head">
      <div>
        <h2>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Response modes
        </h2>
        <p>Pick as many as you like — each one layers extra instructions onto every reply in this chat. Stack a depth mode with any of the others to fully shape how Nexus answers.</p>
      </div>
      <button class="close-btn" id="modesClose" aria-label="Close modes">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="modes-body" id="modesBody">
      <!-- groups + cards injected by JS from MODE_DEFS -->
    </div>
    <div class="modes-actions">
      <div class="mleft"><button type="button" id="modesClearBtn">Clear all</button></div>
      <div class="mright">
        <button type="button" class="btn-secondary" id="modesCancelBtn">Cancel</button>
        <button type="button" class="btn-primary" id="modesSaveBtn">Apply</button>
      </div>
    </div>
  </div>
</div>

<!-- TOPICS MODAL — CFA Level I curriculum browser -->
<div class="topics-overlay" id="topicsOverlay">
  <div class="topics-modal">
    <div class="topics-head">
      <div>
        <h2>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V4a2 2 0 00-2-2H6.5A2.5 2.5 0 004 4.5v15z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          CFA Level I curriculum
        </h2>
        <p>10 volumes, 94 learning modules. Click a module for the full topic, or expand it with the arrow to jump straight to a specific subtopic — either way Nexus sends a detailed-explanation request straight to the chat.</p>
      </div>
      <button class="close-btn" id="topicsClose" aria-label="Close topics">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="topics-search-row">
      <input type="text" id="topicsSearchInput" placeholder="Search modules — e.g. &quot;duration&quot;, &quot;hypothesis testing&quot;, &quot;GIPS&quot;…" autocomplete="off">
    </div>
    <div class="topics-body" id="topicsBody">
      <!-- volumes + modules injected by JS from OUTLINE_DATA -->
    </div>
    <div class="topics-foot">
      <span class="tleft" id="topicsFootCount">94 modules · 420+ subtopics</span>
      <div class="tright">
        <select class="topics-depth-select" id="topicsDepthSelect" title="How deep should the explanation go?">
          <option value="standard">Standard depth</option>
          <option value="advanced" selected>Advanced depth</option>
          <option value="mastery">Full mastery walkthrough</option>
        </select>
      </div>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
(function(){
  /* ---------------- storage helpers ---------------- */
  const LS = {
    get(k, fallback){ try{ const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); }catch{ return fallback; } },
    set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
  };

  const DEFAULT_MODELS = { nvidia: 'meta/llama-3.1-8b-instruct', openrouter: 'openrouter/auto' };
  const HEADER_NAMES = { nvidia: 'X-NVIDIA-Key', openrouter: 'X-OpenRouter-Key' };
  const SAVED_MODEL_SEEDS = {
    nvidia: ['meta/llama-3.1-8b-instruct','meta/llama-3.3-70b-instruct','qwen/qwen3-next-80b-a3b-instruct','nvidia/nemotron-3-super-120b-a17b-instruct','nvidia/nemotron-3-ultra-550b-a17b-instruct'],
    openrouter: ['openrouter/auto','anthropic/claude-3.5-sonnet','openai/gpt-4o-mini']
  };

  let conversations = LS.get('nexus_conversations', []); // [{id,title,provider,model,messages:[],updatedAt}]
  // migrate older saved chats that predate the side-chat feature
  conversations.forEach(c => {
    if (!Array.isArray(c.sideMessages)) c.sideMessages = [];
    if (typeof c.sideOpen !== 'boolean') c.sideOpen = false;
  });
  let activeId = LS.get('nexus_active_id', null);
  let lastModes = LS.get('nexus_last_modes', []); // sticky default: modes carry over into new chats until changed
  let draft = { // unsaved settings-modal state, applied to session config on Save
    provider: LS.get('nexus_provider', 'nvidia'),
    keys: LS.get('nexus_keys', {}),
    models: LS.get('nexus_models', SAVED_MODEL_SEEDS),
    activeModel: LS.get('nexus_active_model', {}),
    system: LS.get('nexus_system', ''),
    prompts: LS.get('nexus_prompts', ['Explain like I\'m five:','Summarize in three bullet points:','Refactor this code for clarity:']),
    theme: LS.get('nexus_theme', 'ink'),
    compact: LS.get('nexus_compact', false),
    pulse: LS.get('nexus_pulse', true)
  };
  // live/applied config == draft until modal is opened, edited, then either saved or cancelled
  let applied = JSON.parse(JSON.stringify(draft));

  function persistAll(){
    LS.set('nexus_conversations', conversations);
    LS.set('nexus_active_id', activeId);
    LS.set('nexus_last_modes', lastModes);
    LS.set('nexus_provider', applied.provider);
    LS.set('nexus_keys', applied.keys);
    LS.set('nexus_models', applied.models);
    LS.set('nexus_active_model', applied.activeModel);
    LS.set('nexus_system', applied.system);
    LS.set('nexus_prompts', applied.prompts);
    LS.set('nexus_theme', applied.theme);
    LS.set('nexus_compact', applied.compact);
    LS.set('nexus_pulse', applied.pulse);
  }

  const $ = id => document.getElementById(id);
  const els = {
    sidebar: $('sidebar'), scrim: $('scrim'), menuBtn: $('menuBtn'),
    newChatBtn: $('newChatBtn'), searchInput: $('searchInput'), convoList: $('convoList'),
    settingsBtn: $('settingsBtn'), topSettingsBtn: $('topSettingsBtn'),
    providerBadge: $('providerBadge'), topModelName: $('topModelName'),
    thread: $('thread'), threadInner: $('threadInner'), emptyState: $('emptyState'),
    dualToggle: $('dualToggle'),
    modesToggle: $('modesToggle'), modesLabel: $('modesLabel'), modesCount: $('modesCount'), modesOverlay: $('modesOverlay'), modesClose: $('modesClose'),
    modesBody: $('modesBody'), modesClearBtn: $('modesClearBtn'), modesCancelBtn: $('modesCancelBtn'), modesSaveBtn: $('modesSaveBtn'),
    topicsBtn: $('topicsBtn'), topicsToggle: $('topicsToggle'), topicsOverlay: $('topicsOverlay'), topicsClose: $('topicsClose'),
    topicsBody: $('topicsBody'), topicsSearchInput: $('topicsSearchInput'), topicsFootCount: $('topicsFootCount'),
    topicsDepthSelect: $('topicsDepthSelect'), browseTopicsChip: $('browseTopicsChip'),
    bodyRow: $('bodyRow'), sidePanel: $('sidePanel'), sideScrim: $('sideScrim'),
    sideThread: $('sideThread'), sideEmpty: $('sideEmpty'),
    sideMessageInput: $('sideMessageInput'), sideSendBtn: $('sideSendBtn'),
    sideCloseBtn: $('sideCloseBtn'), sideClearBtn: $('sideClearBtn'),
    pulseTop: $('pulseTop'), pulseBottom: $('pulseBottom'),
    messageInput: $('messageInput'), sendBtn: $('sendBtn'), charCount: $('charCount'),
    toast: $('toast'),
    modalOverlay: $('modalOverlay'), modalClose: $('modalClose'), modalCancel: $('modalCancel'), modalSave: $('modalSave'),
    tabs: document.querySelectorAll('.modal-tab'), panes: document.querySelectorAll('.modal-pane'),
    providerToggle: $('providerToggle'), keyLabel: $('keyLabel'), keyDesc: $('keyDesc'),
    apiKeyInput: $('apiKeyInput'), toggleKeyVis: $('toggleKeyVis'), keyValidationMsg: $('keyValidationMsg'),
    modelInput: $('modelInput'), modelDesc: $('modelDesc'), pinModelBtn: $('pinModelBtn'), modelChips: $('modelChips'),
    systemPrompt: $('systemPrompt'), promptChips: $('promptChips'), newPromptInput: $('newPromptInput'), addPromptBtn: $('addPromptBtn'),
    themeInk: $('themeInk'), themeGraphite: $('themeGraphite'), compactToggle: $('compactToggle'), pulseToggle: $('pulseToggle'),
    statConvos: $('statConvos'), statMsgs: $('statMsgs'),
    clearConvosBtn: $('clearConvosBtn'), resetAllBtn: $('resetAllBtn')
  };

  /* ---------------- markdown + latex rendering ---------------- */
  function escapeHtml(str){ return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  function renderMarkdown(src){
    const stash = [];
    let s = src.replace(/\\\[([\s\S]+?)\\\]/g, (m, tex) => { stash.push({disp:true, tex}); return '\u0000LX' + (stash.length-1) + '\u0000'; });
    s = s.replace(/\\\(([\s\S]+?)\\\)/g, (m, tex) => { stash.push({disp:false, tex}); return '\u0000LX' + (stash.length-1) + '\u0000'; });
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, (m, tex) => { stash.push({disp:true, tex}); return '\u0000LX' + (stash.length-1) + '\u0000'; });
    s = s.replace(/\$([^\$\n]+?)\$/g, (m, tex) => { stash.push({disp:false, tex}); return '\u0000LX' + (stash.length-1) + '\u0000'; });

    const codeStash = [];
    s = s.replace(/```([a-zA-Z0-9]*)\n?([\s\S]*?)```/g, (m, lang, code) => { codeStash.push(code.replace(/\n$/, '')); return '\u0000CB' + (codeStash.length-1) + '\u0000'; });

    s = escapeHtml(s);

    s = s.replace(/\u0000CB(\d+)\u0000/g, (m, i) => '<pre><code>' + escapeHtml(codeStash[i]) + '</code></pre>');

    s = s.replace(/((?:^\|.*\|[ \t]*\n)+)/gm, block => {
      const lines = block.trim().split('\n').filter(Boolean);
      if (lines.length < 2 || !/^\s*\|?[\s:|-]+\|?\s*$/.test(lines[1])) return block;
      const parseRow = l => l.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
      const head = parseRow(lines[0]);
      const rows = lines.slice(2).map(parseRow);
      let html = '<div class="table-scroll"><table><thead><tr>' + head.map(h=>'<th>'+h+'</th>').join('') + '</tr></thead><tbody>';
      rows.forEach(r => { html += '<tr>' + r.map(c=>'<td>'+c+'</td>').join('') + '</tr>'; });
      html += '</tbody></table></div>';
      return html;
    });

    s = s.replace(/^### (.*)$/gm, '<h3>$1</h3>').replace(/^## (.*)$/gm, '<h2>$1</h2>').replace(/^# (.*)$/gm, '<h1>$1</h1>');
    s = s.replace(/^---+$/gm, '<hr>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');

    s = s.replace(/(^|\n)((?:[ \t]*[-*] .*(?:\n|$))+)/g, (m, pre, block) => {
      const items = block.trim().split('\n').map(l => l.replace(/^[ \t]*[-*] /, ''));
      return pre + '<ul>' + items.map(i=>'<li>'+i+'</li>').join('') + '</ul>\n';
    });
    s = s.replace(/(^|\n)((?:[ \t]*\d+\. .*(?:\n|$))+)/g, (m, pre, block) => {
      const items = block.trim().split('\n').map(l => l.replace(/^[ \t]*\d+\. /, ''));
      return pre + '<ol>' + items.map(i=>'<li>'+i+'</li>').join('') + '</ol>\n';
    });

    s = s.split(/\n{2,}/).map(chunk => {
      const t = chunk.trim();
      if (!t) return '';
      if (/^<(h1|h2|h3|ul|ol|pre|div|hr|table)/.test(t)) return t;
      return '<p>' + t.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');

    s = s.replace(/\u0000LX(\d+)\u0000/g, (m, i) => {
      const item = stash[i];
      return item.disp ? ('$$' + item.tex + '$$') : ('$' + item.tex + '$');
    });

    return s;
  }

  function renderKatexIn(el){
    if (window.renderMathInElement) {
      try {
        renderMathInElement(el, {
          delimiters: [
            {left:'$$', right:'$$', display:true},
            {left:'$', right:'$', display:false},
            {left:'\\[', right:'\\]', display:true},
            {left:'\\(', right:'\\)', display:false}
          ],
          throwOnError:false
        });
      } catch {}
    }
  }

  /* ---------------- conversations ---------------- */
  function uid(){ return 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

  function newConversationObj(){
    return {
      id: 'c' + Date.now() + Math.random().toString(36).slice(2,7),
      title: 'New chat',
      provider: applied.provider,
      model: applied.activeModel[applied.provider] || DEFAULT_MODELS[applied.provider],
      messages: [],       // flat store: {id, parentId, role, content, meta}
      activeLeaf: null,   // id of the message at the tip of the currently-viewed branch
      sideOpen: false,       // whether the side-chat panel is open for this conversation
      sideMessages: [],      // side chat: a small independent linear conversation (no branching)
      modes: lastModes.slice(), // sticky: new chats start with whatever modes were last active, not empty
      updatedAt: Date.now()
    };
  }

  // path from root to a given leaf id (inclusive), following parentId chain
  function pathTo(convo, leafId){
    const byId = {}; convo.messages.forEach(m => byId[m.id] = m);
    const path = [];
    let cur = leafId ? byId[leafId] : null;
    while (cur) { path.unshift(cur); cur = cur.parentId ? byId[cur.parentId] : null; }
    return path;
  }

  // children of a given message id (siblings share the same parentId)
  function childrenOf(convo, parentId){
    return convo.messages.filter(m => m.parentId === parentId);
  }

  function getActive(){ return conversations.find(c => c.id === activeId) || null; }

  function renderConvoList(){
    const q = els.searchInput.value.trim().toLowerCase();
    const filtered = conversations.filter(c => !q || c.title.toLowerCase().includes(q)).sort((a,b) => b.updatedAt - a.updatedAt);
    els.convoList.innerHTML = '';
    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'convo-empty';
      empty.textContent = conversations.length ? 'No conversations match your search.' : 'No conversations yet — start one below.';
      els.convoList.appendChild(empty);
      return;
    }
    const label = document.createElement('div');
    label.className = 'convo-group-label';
    label.textContent = 'Recent';
    els.convoList.appendChild(label);
    filtered.forEach(c => {
      const item = document.createElement('div');
      item.className = 'convo-item provider-' + c.provider + (c.id === activeId ? ' active' : '');
      item.tabIndex = 0;
      item.innerHTML = '<span class="pdot"></span><span class="ctitle"></span><button class="cdel" aria-label="Delete conversation"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>';
      item.querySelector('.ctitle').textContent = c.title;
      item.addEventListener('click', (e) => { if (e.target.closest('.cdel')) return; switchConversation(c.id); });
      item.querySelector('.cdel').addEventListener('click', (e) => { e.stopPropagation(); deleteConversation(c.id); });
      els.convoList.appendChild(item);
    });
  }

  function switchConversation(id){
    activeId = id;
    persistAll();
    const c = getActive();
    if (c) { applied.provider = c.provider; }
    renderThreadFromActive();
    renderConvoList();
    syncTopbar();
    syncModesToggle();
    syncDualToggle();
  }

  function deleteConversation(id){
    conversations = conversations.filter(c => c.id !== id);
    if (activeId === id) activeId = conversations[0]?.id || null;
    persistAll();
    renderConvoList();
    renderThreadFromActive();
    syncTopbar();
    syncModesToggle();
    syncDualToggle();
    showToast('Conversation deleted');
  }

  function ensureActiveConversation(){
    if (!getActive()) {
      const c = newConversationObj();
      conversations.push(c);
      activeId = c.id;
      persistAll();
      renderConvoList();
    }
    return getActive();
  }

  els.newChatBtn.addEventListener('click', () => {
    const c = newConversationObj();
    conversations.push(c);
    activeId = c.id;
    persistAll();
    renderConvoList();
    renderThreadFromActive();
    syncTopbar();
    syncModesToggle();
    syncDualToggle();
    els.messageInput.focus();
    if (window.innerWidth <= 880) closeSidebar();
  });
  els.searchInput.addEventListener('input', renderConvoList);

  function renderThreadFromActive(){
    streamGen++; // invalidate any in-flight simulated stream targeting now-replaced DOM
    els.threadInner.innerHTML = '';
    const c = getActive();
    if (!c || !c.messages.length) {
      els.threadInner.appendChild(els.emptyState);
      els.emptyState.style.display = 'flex';
      return;
    }
    els.emptyState.style.display = 'none';
    const leaf = c.activeLeaf || c.messages[c.messages.length - 1].id;
    const path = pathTo(c, leaf);
    path.forEach(m => {
      const { wrap } = renderBubble(m.role, m.content, { provider: c.provider, meta: m.meta, msgId: m.id });
      // branch switcher: if this message has siblings (other children of same parent), show 1/N controls
      const siblings = childrenOf(c, m.parentId);
      if (siblings.length > 1) {
        const idx = siblings.findIndex(s => s.id === m.id);
        addBranchSwitcher(wrap, c, siblings, idx);
      }
      // branch button on assistant messages, to start a new branch from here
      if (m.role === 'assistant') addBranchButton(wrap, c, m.id);
    });
    els.thread.scrollTop = els.thread.scrollHeight;
  }

  function addBranchSwitcher(wrap, convo, siblings, idx){
    const row = document.createElement('div');
    row.className = 'branch-switch';
    const prev = document.createElement('button');
    prev.type = 'button'; prev.className = 'branch-nav'; prev.innerHTML = '‹';
    prev.disabled = idx <= 0;
    prev.addEventListener('click', () => jumpToBranch(convo, siblings[idx - 1].id));
    const label = document.createElement('span');
    label.className = 'branch-label'; label.textContent = (idx + 1) + ' / ' + siblings.length;
    const next = document.createElement('button');
    next.type = 'button'; next.className = 'branch-nav'; next.innerHTML = '›';
    next.disabled = idx >= siblings.length - 1;
    next.addEventListener('click', () => jumpToBranch(convo, siblings[idx + 1].id));
    row.appendChild(prev); row.appendChild(label); row.appendChild(next);
    wrap.querySelector('.bubble-wrap').appendChild(row);
  }

  function addBranchButton(wrap, convo, msgId){
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'branch-new-btn'; btn.title = 'Branch a new thread from here';
    btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 3v10a4 4 0 004 4h4M14 13l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Branch';
    btn.addEventListener('click', () => startBranch(convo, msgId));
    wrap.querySelector('.bubble-wrap').appendChild(btn);
  }

  // find the deepest leaf that descends from a given node, following the "first child" by default
  function deepestLeaf(convo, nodeId){
    let cur = nodeId;
    while (true) {
      const kids = childrenOf(convo, cur);
      if (!kids.length) return cur;
      cur = kids[0].id;
    }
  }

  function jumpToBranch(convo, siblingId){
    convo.activeLeaf = deepestLeaf(convo, siblingId);
    persistAll();
    renderThreadFromActive();
  }

  function startBranch(convo, fromMsgId){
    // set active leaf to the branch point; next sent message becomes a new sibling branch
    convo.activeLeaf = fromMsgId;
    persistAll();
    renderThreadFromActive();
    els.messageInput.focus();
    showToast('New branch started — send a message to continue it');
  }

  function renderBubble(role, text, opts){
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'msg ' + role + (opts.provider ? ' provider-' + opts.provider : '');
    if (opts.msgId) wrap.dataset.msgId = opts.msgId;
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = role === 'user' ? 'YOU' : (opts.provider === 'openrouter' ? 'OR' : 'NV');
    const bwrap = document.createElement('div');
    bwrap.className = 'bubble-wrap';
    const bubble = document.createElement('div');
    bubble.className = 'bubble' + (opts.error ? ' error-bubble' : '');
    if (opts.typing) {
      bubble.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    } else if (role === 'user') {
      bubble.textContent = text;
    } else {
      bubble.innerHTML = renderMarkdown(text);
      renderKatexIn(bubble);
    }
    bwrap.appendChild(bubble);
    if (opts.meta) {
      const meta = document.createElement('div');
      meta.className = 'meta-line';
      meta.textContent = opts.meta;
      bwrap.appendChild(meta);
    }
    wrap.appendChild(avatar);
    wrap.appendChild(bwrap);
    els.threadInner.appendChild(wrap);
    els.thread.scrollTop = els.thread.scrollHeight;
    return { wrap, bubble };
  }

  /* ---------------- simulated streaming reveal ---------------- */
  let streamGen = 0;
  // Reveals `fullText` into `bubbleEl` progressively so it feels like it's generating live,
  // even though we already have the complete response from /api/chat.
  function streamReveal(bubbleEl, fullText, onDone){
    const myGen = ++streamGen;
    bubbleEl.classList.remove('error-bubble');
    // Split into small chunks (word-ish) for a natural typing cadence
    const chunks = fullText.match(/\S+\s*|\s+/g) || [fullText];
    let i = 0;
    let acc = '';
    const CHUNK_MS = 16; // reveal speed
    const STEP = 1; // chunks per tick
    function tick(){
      if (myGen !== streamGen) return; // superseded by a new send/switch — abandon this stream
      if (i >= chunks.length) {
        bubbleEl.innerHTML = renderMarkdown(fullText);
        renderKatexIn(bubbleEl);
        if (onDone) onDone();
        return;
      }
      for (let k = 0; k < STEP && i < chunks.length; k++, i++) acc += chunks[i];
      // render partial markdown live; safe since renderMarkdown degrades gracefully on incomplete input
      bubbleEl.innerHTML = renderMarkdown(acc) + '<span class="stream-caret"></span>';
      els.thread.scrollTop = els.thread.scrollHeight;
      setTimeout(tick, CHUNK_MS);
    }
    tick();
  }

  /* ---------------- topbar / provider sync ---------------- */

  /* ---------------- side chat (independent scratch conversation) ---------------- */
  function syncDualToggle(){
    const c = getActive();
    const open = !!(c && c.sideOpen);
    if (els.dualToggle) els.dualToggle.classList.toggle('on', open);
    if (els.sidePanel) els.sidePanel.classList.toggle('open', open);
    if (els.sideScrim) els.sideScrim.classList.toggle('show', open && window.innerWidth <= 880);
    if (open) renderSideThread();
  }
  function toggleSidePanel(force){
    const c = ensureActiveConversation();
    c.sideOpen = typeof force === 'boolean' ? force : !c.sideOpen;
    persistAll();
    syncDualToggle();
    if (c.sideOpen && els.sideMessageInput) setTimeout(() => els.sideMessageInput.focus(), 180);
  }
  if (els.dualToggle) els.dualToggle.addEventListener('click', () => toggleSidePanel());
  if (els.sideCloseBtn) els.sideCloseBtn.addEventListener('click', () => toggleSidePanel(false));
  if (els.sideScrim) els.sideScrim.addEventListener('click', () => toggleSidePanel(false));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const c = getActive();
    if (c && c.sideOpen) toggleSidePanel(false);
  });
  if (els.sideClearBtn) {
    els.sideClearBtn.addEventListener('click', () => {
      const c = getActive();
      if (!c || !c.sideMessages.length) return;
      if (!confirm('Clear the side chat?')) return;
      c.sideMessages = [];
      persistAll();
      renderSideThread();
      showToast('Side chat cleared');
    });
  }

  function renderSideThread(){
    const c = getActive();
    if (!els.sideThread) return;
    els.sideThread.innerHTML = '';
    const msgs = (c && c.sideMessages) || [];
    if (!msgs.length) {
      const empty = document.createElement('div');
      empty.className = 'side-empty';
      empty.textContent = 'Ask a quick, unrelated side question here — like "what does that term mean?" — without adding it to the main conversation. Each side-chat message is answered fresh, with no memory of earlier side-chat turns or the main conversation.';
      els.sideThread.appendChild(empty);
      return;
    }
    msgs.forEach(m => els.sideThread.appendChild(renderSideBubble(m.role, m.content)));
    els.sideThread.scrollTop = els.sideThread.scrollHeight;
  }

  function renderSideBubble(role, text){
    const wrap = document.createElement('div');
    wrap.className = 'side-msg ' + role;
    const label = document.createElement('div');
    label.className = 'role-label';
    label.textContent = role === 'user' ? 'You' : 'Answer';
    wrap.appendChild(label);
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    if (role === 'user') bubble.textContent = text;
    else { bubble.innerHTML = text ? renderMarkdown(text) : '<div class="typing"><span></span><span></span><span></span></div>'; renderKatexIn(bubble); }
    wrap.appendChild(bubble);
    return wrap;
  }

  els.sideMessageInput && els.sideMessageInput.addEventListener('input', () => {
    els.sideMessageInput.style.height = 'auto';
    els.sideMessageInput.style.height = Math.min(els.sideMessageInput.scrollHeight, 110) + 'px';
  });
  els.sideMessageInput && els.sideMessageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendSideMessage(); }
  });
  els.sideSendBtn && els.sideSendBtn.addEventListener('click', sendSideMessage);

  let sideBusy = false;
  async function sendSideMessage(){
    if (sideBusy) return;
    const text = els.sideMessageInput.value.trim();
    if (!text) return;
    const convo = ensureActiveConversation();
    const provider = applied.provider;
    const model = applied.activeModel[provider] || DEFAULT_MODELS[provider];
    const apiKey = (applied.keys[provider] || '').trim();

    convo.sideMessages.push({ id: uid(), role: 'user', content: text });
    els.sideMessageInput.value = '';
    els.sideMessageInput.style.height = 'auto';
    persistAll();
    renderSideThread();

    const pendingEl = renderSideBubble('assistant', '');
    els.sideThread.appendChild(pendingEl);
    els.sideThread.scrollTop = els.sideThread.scrollHeight;
    sideBusy = true;
    els.sideSendBtn.disabled = true;

    // Side chat is intentionally a stateless, single-turn scratch tool: it does not ground itself in
    // the main conversation, and it does not carry memory of its own earlier turns either. Every
    // message sent here is answered completely fresh — the running list in the panel is just a
    // local log for the person to scroll back through, not conversation history sent to the model.
    // It also does not inherit the main chat's active response Modes, for the same reason: this is
    // meant to be a fast, unrelated, low-friction lookup, not a second thread of the same chat.
    const sys = [];
    if (applied.system.trim()) sys.push(applied.system.trim());
    sys.push(SIDE_CHAT_DIRECTIVE);
    const payloadMessages = [{ role: 'system', content: sys.join('\n\n') }, { role: 'user', content: text }];

    const headers = { 'Content-Type': 'application/json', 'X-Provider': provider };
    if (apiKey) headers[HEADER_NAMES[provider]] = apiKey;

    try {
      const res = await fetch('/api/chat', { method: 'POST', headers, body: JSON.stringify({ model, messages: payloadMessages, stream: false }) });
      const raw = await res.text();
      let data; try { data = JSON.parse(raw); } catch { data = null; }
      const looksLikeHtml = !data && typeof raw === 'string' && /^\s*<(!DOCTYPE|html)/i.test(raw);
      if (!res.ok || !data || looksLikeHtml) {
        if (looksLikeHtml) throw new Error('The chat backend returned a web page instead of a response (HTTP ' + res.status + '). /api/chat may not be deployed on this host.');
        throw new Error((data && data.error && data.error.message) || raw || ('Request failed with status ' + res.status));
      }
      const reply = data?.choices?.[0]?.message?.content ?? '(empty response)';
      convo.sideMessages.push({ id: uid(), role: 'assistant', content: reply });
      persistAll();
      renderSideThread();
    } catch (err) {
      pendingEl.querySelector('.bubble').className = 'bubble error-bubble';
      pendingEl.querySelector('.bubble').textContent = 'Error: ' + err.message;
      showToast('Side chat request failed', true);
    } finally {
      sideBusy = false;
      els.sideSendBtn.disabled = false;
      els.sideMessageInput.focus();
    }
  }

  function syncTopbar(){
    const p = applied.provider;
    if (els.providerBadge) {
      els.providerBadge.className = 'route-chip ' + p;
      els.providerBadge.innerHTML = '<span class="rdot"></span>' + (p === 'nvidia' ? 'NVIDIA NIM' : 'OpenRouter');
    }
    const model = applied.activeModel[p] || DEFAULT_MODELS[p];
    if (els.topModelName) els.topModelName.textContent = model;
    els.sendBtn.dataset.provider = p;
    els.newChatBtn.dataset.provider = p;
    if (els.pulseTop) els.pulseTop.style.opacity = applied.pulse ? (p === 'nvidia' ? '.85' : '.18') : '0';
    if (els.pulseBottom) els.pulseBottom.style.opacity = applied.pulse ? (p === 'openrouter' ? '.85' : '.18') : '0';
  }

  /* ---------------- composer ---------------- */
  els.messageInput.addEventListener('input', () => {
    els.messageInput.style.height = 'auto';
    els.messageInput.style.height = Math.min(els.messageInput.scrollHeight, 180) + 'px';
    if (els.charCount) els.charCount.textContent = els.messageInput.value.length;
  });
  els.messageInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
  els.sendBtn.addEventListener('click', sendMessage);
  document.querySelectorAll('.chip[data-fill]').forEach(chip => {
    chip.addEventListener('click', () => {
      els.messageInput.value = chip.dataset.fill;
      els.messageInput.dispatchEvent(new Event('input'));
      els.messageInput.focus();
    });
  });

  function showToast(msg, isErr){
    els.toast.textContent = msg;
    els.toast.classList.toggle('err', !!isErr);
    els.toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => els.toast.classList.remove('show'), 2600);
  }


  // Dedicated directive for the side chat scratch panel. This is intentionally independent of
  // Modes — the side chat's entire purpose is a fast, low-friction lookup next to the main
  // thread, so replies here stay short regardless of what Modes are active in the main conversation.
  const SIDE_CHAT_DIRECTIVE = "You are answering inside a side chat: a small scratch panel next to the main conversation, meant for quick lookups and clarifications, not for deep teaching or long-form writing. Every reply here must be short and strictly on point:\n\n1. Answer only the exact question asked — do not also explain related concepts, background, or context the person didn't ask for.\n2. Default to 1–3 sentences. Only exceed that if the question literally cannot be answered correctly in fewer words (e.g. it requires a short list of concrete steps).\n3. If a list is genuinely needed, cap it at the minimum number of items required — no padding items added for completeness.\n4. Never add an introduction, a restatement of the question, or a closing summary — start with the answer and stop when it's given.\n5. Do not include a worked example, analogy, or illustrative story unless the question explicitly asks for one.\n6. Do not include caveats, disclaimers, or 'it depends' hedging unless the answer is actually wrong without them.\n7. Do not offer to elaborate, ask a follow-up question, or suggest what to ask next — let the person ask if they want more.\n8. Skip headings, bold section labels, and multi-part structure entirely; a side-chat answer should read as one short block or a tight list, never a mini-report.\n9. If code is requested, give only the minimal snippet needed — no surrounding explanation unless asked.\n10. If the honest answer is a single word, a short phrase, or one sentence, give exactly that and nothing more.";

  let busy = false;
  async function sendMessage(){
    if (busy) return;
    const text = els.messageInput.value.trim();
    if (!text) return;
    const provider = applied.provider;
    const model = applied.activeModel[provider] || DEFAULT_MODELS[provider];
    const apiKey = (applied.keys[provider] || '').trim();

    const convo = ensureActiveConversation();
    convo.provider = provider; convo.model = model;
    if (convo.messages.length === 0) convo.title = text.slice(0, 46) + (text.length > 46 ? '…' : '');

    // new user message attaches under the current active leaf (branch point)
    const parentId = convo.activeLeaf || (convo.messages.length ? convo.messages[convo.messages.length - 1].id : null);
    const userMsg = { id: uid(), parentId, role: 'user', content: text };
    convo.messages.push(userMsg);
    convo.activeLeaf = userMsg.id;
    convo.updatedAt = Date.now();

    els.emptyState.style.display = 'none';
    renderBubble('user', text, { msgId: userMsg.id });
    els.messageInput.value = '';
    els.messageInput.style.height = 'auto';
    if (els.charCount) els.charCount.textContent = '0';
    persistAll();
    renderConvoList();

    const pending = renderBubble('assistant', '', { typing: true, provider });
    busy = true;
    els.sendBtn.disabled = true;

    const payloadMessages = [];
    const sys = buildSystemMessages(convo);
    if (sys.length) payloadMessages.push({ role: 'system', content: sys.join('\n\n') });
    // walk the active branch path (not the whole flat array) for conversation context
    pathTo(convo, userMsg.id).forEach(m => payloadMessages.push({ role: m.role, content: m.content }));

    // Recency reinforcement: a system message written once at the top of a long conversation is a
    // weaker signal than the established pattern of prior replies, so a mode toggled on mid-thread
    // can otherwise get ignored as the model just continues the earlier tone. Restate the active
    // modes right next to the newest user turn so the instruction has real positional weight —
    // API payload only, this never touches the stored message or what's shown in the chat bubble.
    const activeModesForSend = getActiveModes(convo);
    if (activeModesForSend.length) {
      const lastMsg = payloadMessages[payloadMessages.length - 1];
      if (lastMsg && lastMsg.role === 'user') {
        const modeNames = activeModesForSend.map(id => MODE_NAMES[id]).join(', ');
        lastMsg.content += '\n\n[Active response mode' + (activeModesForSend.length > 1 ? 's' : '') + ' for this reply: ' + modeNames + '. Apply ' + (activeModesForSend.length > 1 ? 'them' : 'it') + ' fully, even if earlier replies above were written differently.]';
      }
    }

    const headers = { 'Content-Type': 'application/json', 'X-Provider': provider };
    if (apiKey) headers[HEADER_NAMES[provider]] = apiKey;

    try {
      const res = await fetch('/api/chat', { method: 'POST', headers, body: JSON.stringify({ model, messages: payloadMessages, stream: false }) });
      const raw = await res.text();
      let data; try { data = JSON.parse(raw); } catch { data = null; }

      // If /api/chat is missing, misconfigured, or the deployment routes to a fallback page,
      // the server can respond 200/404/etc with an HTML document instead of JSON. Never treat
      // that as a valid chat reply — surface it as a clear error instead of dumping raw markup
      // into the thread.
      const looksLikeHtml = !data && typeof raw === 'string' && /^\s*<(!DOCTYPE|html)/i.test(raw);
      if (!res.ok || !data || looksLikeHtml) {
        let msg;
        if (looksLikeHtml) {
          msg = 'The chat backend returned a web page instead of a response (HTTP ' + res.status + '). This usually means /api/chat isn\'t deployed or routed correctly on this host — check your backend deployment rather than your API key.';
        } else {
          msg = (data && data.error && data.error.message) || raw || ('Request failed with status ' + res.status);
        }
        pending.bubble.className = 'bubble error-bubble';
        pending.bubble.textContent = msg;
        showToast('Request failed', true);
        busy = false; els.sendBtn.disabled = false;
        return;
      }
      const reply = data?.choices?.[0]?.message?.content ?? '(empty response)';
      const asstMsg = { id: uid(), parentId: userMsg.id, role: 'assistant', content: reply };
      convo.messages.push(asstMsg);
      convo.activeLeaf = asstMsg.id;
      convo.updatedAt = Date.now();
      persistAll();
      renderConvoList();

      streamReveal(pending.bubble, reply, () => {
        busy = false;
        els.sendBtn.disabled = false;
        renderThreadFromActive(); // re-render to attach branch button now that it's committed
        els.messageInput.focus();
      });
    } catch (err) {
      pending.bubble.className = 'bubble error-bubble';
      pending.bubble.textContent = 'Network error: ' + err.message;
      showToast('Could not reach /api/chat', true);
      busy = false;
      els.sendBtn.disabled = false;
      els.thread.scrollTop = els.thread.scrollHeight;
      els.messageInput.focus();
    }
  }

  /* ---------------- response modes ---------------- */
  // Stackable modes — the single control surface for shaping how Nexus answers. Any number can be
  // active at once per-conversation; each contributes one directive string that gets appended to
  // the system messages sent with every turn. There is no separate depth dial: calibration itself
  // (Standard/Advanced/Mastery/Research-style depth) lives here as ordinary modes, so it composes
  // with everything else instead of sitting apart from it.
  const MODE_DEFS = [
    { group: '🎚️ Depth & Calibration', modes: [
      { id: 'standard', name: 'Standard', desc: 'Clear, correct, no ceremony — proportional to what was actually asked.',
        directive: "Activate Standard Mode. The person wants a clear, correct, usable answer with minimal ceremony — this is a deliberate default, not a diluted version of the deeper modes.\n\n1. Answer the actual question in the first sentence or two, before any setup or background.\n2. Keep explanations proportional to what was asked — a simple question gets a simple answer, not a full teaching breakdown. Test: could a knowledgeable person answer this out loud, conversationally, in a sentence or two? If yes, write it that way.\n3. Use plain, everyday language over jargon; if a technical term is genuinely necessary, define it briefly in the same sentence rather than assuming it's known.\n4. Skip framework scaffolding — no forced headings, no manufactured structure — unless the content is naturally long enough to need it for readability.\n5. Include an example only when it clarifies something words alone wouldn't, not as a default habit.\n6. Do not pad with disclaimers, throat-clearing, or restating the question back before answering it.\n7. Do not close with a quiz question, a follow-up prompt, or 'let me know if you want more detail' — let the answer stand on its own.\n8. If the question is ambiguous, make the most reasonable assumption and state it in one clause rather than stopping to ask.\n9. Prefer concrete specifics — numbers, names, exact steps — over vague generalities whenever they're available.\n10. It is fine, and often better, for the whole answer to be a few sentences or a short list rather than multiple paragraphs." },
      { id: 'advanced', name: 'Advanced', desc: 'Expert-mentor depth: mechanics, trade-offs, and precise vocabulary, without a full teaching workup.',
        directive: "Activate Advanced Mode. Act as an expert-level mentor for a capable, motivated person who wants real depth — not a summary, and not the full pedagogical workup of Mastery Mode.\n\n1. Lead with the direct answer or core claim in the first one or two sentences, then use the rest of the response to add depth.\n2. Go deep, not just wide: explain the underlying mechanics and the 'why' behind a rule of thumb, not just the rule itself.\n3. Name where people typically get this wrong, in a sentence or two — not a full section.\n4. Use precise technical vocabulary, defining any non-obvious term inline the first time it appears rather than in a glossary.\n5. Prefer one well-chosen worked example or comparison over an abstract, example-free definition.\n6. Show the actual math, formula, or code where relevant rather than describing it in prose.\n7. Note real trade-offs or alternative approaches only when they materially affect the answer — don't force a comparison table onto a simple question.\n8. Don't pad with filler, hedging, or excessive caveats — write like a top practitioner explaining this to a sharp peer who wants to actually get good at it.\n9. When the 'textbook' answer and the 'in practice' answer diverge, say so explicitly and give both rather than quietly picking one.\n10. Don't re-explain fundamentals the question already signals the person has — calibrate up as that becomes clear over the conversation." },
      { id: 'mastery', name: 'Mastery', desc: 'Full tutor framework: mechanism, worked example, misconceptions, and a check-understanding question.',
        directive: "Activate Mastery Mode, teaching toward durable, transferable understanding — not a correct-sounding answer that gets forgotten in a week. Use this six-stage framework, adapting it to the question and skipping a stage only when it genuinely doesn't apply.\n\n1. Core idea first — one or two sentences giving the essential concept in plain terms, before any jargon or formalism.\n2. Mechanism — explain *why* it works or *why* it's true, tracing the actual causal chain or derivation, not stating conclusions as facts to accept on authority.\n3. Worked example — walk through at least one concrete example step by step, showing intermediate work, not just the final result.\n4. Where it breaks / common misconceptions — name the specific mistake a learner is likely to make here, and exactly why it's wrong. This is often the highest-value stage; don't shortchange it.\n5. How it connects — briefly place the idea in context: what it generalizes from, or what related idea it's commonly confused with.\n6. Check your understanding — close with one short, specific question that tests whether the mechanism actually landed, not a trivia-recall question. Ask it and stop; do not answer it yourself.\n7. Use clear headings matching the stage numbers on longer answers; compress or merge stages for genuinely simple content rather than forcing all six onto something trivial." },
      { id: 'research', name: 'Research', desc: 'Graduate-seminar rigor: formal derivations, boundary conditions, and an honest account of what is unsettled.',
        directive: "Activate Research Mode: graduate-seminar / practitioner-briefing rigor, for someone who already has the prerequisites and wants the real structure of the field, not a simplified on-ramp. Write like a technical brief for a knowledgeable peer.\n\n1. State the claim precisely first, using correct formal or technical notation and terminology.\n2. Give the actual derivation, proof sketch, or mechanistic justification — not just the intuition pump. If a full derivation is long, give the key steps and state which parts are elided.\n3. Address boundary conditions explicitly: under what assumptions does this hold, and where does it degrade or fail.\n4. Compare against the leading alternative approach or competing theory, with a concrete mechanistic reason one is preferred in which regime — not a vague pros/cons list.\n5. State plainly what is settled versus still contested or actively researched, and point to the kind of primary source that would let the reader verify the claim themselves.\n6. Flag explicitly if a claim concerns something fast-moving that may have changed since your training data — don't assert the current state of a fast-moving field with unwarranted confidence.\n7. Close with one substantive follow-up question or open problem — the kind that separates memorizing the result from understanding its limits. Do not answer it yourself.\n8. No introductory throat-clearing, no beginner analogies unless one is genuinely load-bearing for the argument. Precision and density matter more than approachability here." } ] },
    { group: '📚 Deep Learning & Mastery', modes: [
      { id: 'first-principles', name: 'First Principles Mode', desc: 'Breaks the topic down to foundational truths and rebuilds it from scratch.',
        directive: "Activate First Principles Mode. Before explaining the topic in the conventional way, strip it down to its most foundational, irreducible truths — the things true independent of convention or received wisdom — then rebuild it from there.\n\n1. Open with a labeled block of the 3-6 foundational truths or axioms the whole explanation rests on.\n2. Explicitly separate what's being assumed as given from what's derived from it — label each as you go, don't let them blur together.\n3. Rebuild the concept step by step from those foundations, showing concretely how each layer follows from the one below it, not just asserting that it does.\n4. Deliberately avoid the conventional textbook order if it differs from the true derivation order — the point is the actual dependency structure, not the familiar presentation.\n5. Close by connecting the rebuilt structure back to the original question, so the derivation clearly lands somewhere." },
      { id: 'feynman', name: 'The Feynman Simulator', desc: 'Acts as a curious novice who pushes back on jargon and logical gaps as you explain.',
        directive: "Activate The Feynman Simulator. When the person explains a concept to you, respond as a curious, intelligent novice testing their explanation — not as an expert validating it.\n\n1. Ask exactly one clarifying or pushback question per turn — don't fire off a list of questions at once.\n2. When something is jargon, name the specific term verbatim and ask what it means rather than a vague 'can you clarify?'\n3. When a logical step doesn't follow, name the specific step verbatim and say exactly where the connection breaks — 'gap between X and Y' is better than 'this part is confusing'.\n4. Distinguish between 'this is genuinely unclear because a step is missing' and 'this is unfamiliar to me but was actually explained fine' — don't manufacture confusion where the explanation was solid.\n5. Don't fill in the gap yourself or supply the missing logic — your job is to expose it, not repair it.\n6. If the explanation is actually complete and sound, say so plainly rather than inventing a critique to stay in character." },
      { id: 'five-whys', name: 'The "5 Whys" Interrogator', desc: 'Drills into a premise by asking "why" five times to reach the root cause.',
        directive: "Activate The '5 Whys' Interrogator. Take the core premise or claim in the message and interrogate it by asking why, repeatedly, with each answer becoming the target of the next why.\n\n1. Identify the single core premise being interrogated before starting the chain — state it in one line.\n2. Show the chain explicitly and visibly: 'Why 1: [question] -> [answer]', 'Why 2: [question targeting that answer] -> [answer]', and so on.\n3. Aim for five iterations, but stop earlier the moment you hit a genuine root cause — don't manufacture a fifth why that just restates the fourth in different words.\n4. If five iterations aren't enough to reach a real root cause, continue rather than stopping artificially at five.\n5. Each answer must be a real causal step, not a synonym or a value judgment ('because it's bad practice' is not a cause).\n6. Close with one line stating the root cause plainly, distinct from the surface-level complaint you started with." },
      { id: 'analogy-engine', name: 'The Analogy Engine', desc: 'Explains strictly through one sustained real-world analogy, no technical definitions.',
        directive: "Activate The Analogy Engine. Explain the topic using one detailed, well-developed real-world analogy as the primary explanatory tool, instead of formal technical definitions.\n\n1. Pick one central analogy that maps structurally onto the real mechanics of the concept — not just a surface resemblance — and commit to it.\n2. Extend that same analogy consistently through the whole explanation; don't switch to a different analogy partway through.\n3. Map the key components explicitly: name what plays the role of each important part of the real concept within the analogy.\n4. Include an explicit 'where this breaks down' note identifying at least one place the analogy stops being accurate — every analogy has one.\n5. Keep the underlying facts correct under the analogy's simplification; the analogy should illuminate the mechanism, not misrepresent it." },
      { id: 'edge-case', name: 'Edge Case & Failure Mode Explorer', desc: 'Focuses on exceptions, limitations, and real historical failures where the rule breaks.',
        directive: "Activate Edge Case & Failure Mode Explorer. Instead of explaining the general rule the normal way, focus the response primarily on where and how it fails.\n\n1. State the general rule or normal case in one or two sentences maximum — it's background context, not the point of the answer.\n2. Spend the majority of the response on boundary conditions, known exceptions, and the specific circumstances that make failure likely.\n3. When citing a historical incident or documented failure, use only real, verifiable cases you're actually confident about — don't invent specific incidents, names, dates, or statistics to sound concrete.\n4. If an example is illustrative rather than a documented case, label it clearly as hypothetical instead of presenting it as a real historical event.\n5. Organize failure modes by mechanism or category rather than as a flat, random list, so the reader sees the pattern behind the failures." },
      { id: 'steel-man', name: 'Steel-Manning Mode', desc: 'Builds the strongest, most rigorous, most charitable case for a position — even one you disagree with.',
        directive: "Activate Steel-Manning Mode. Construct the strongest, most rigorous, most intellectually charitable version of the argument or position in question — not a weak version, and not a hedge-everything both-sides summary.\n\n1. Use the actual evidence and reasoning a genuine, informed advocate for this position would use — not reasoning you're inventing to sound plausible.\n2. Present it as persuasively and honestly as that advocate could, even if it's a position you wouldn't personally endorse.\n3. Make this explicitly the strongest case for the position, not your own assessment of whether it's correct — the framing should make that distinction clear.\n4. Don't undercut the case with an immediate rebuttal in the same breath; let it stand fully before any counterpoint.\n5. If useful, offer at the end to also build the steel-manned case for the opposing position, rather than supplying an unrequested rebuttal." },
      { id: 'polymath', name: 'The Polymath (Cross-Disciplinary) Mode', desc: 'Maps the topic\u2019s mechanics onto an unrelated field to reveal structural parallels.',
        directive: "Activate The Polymath (Cross-Disciplinary) Mode. Explain the topic primarily by mapping its underlying mechanics onto a different field or domain, structurally rather than loosely.\n\n1. Choose one domain that maps well onto the real structure of the concept — not just a domain that sounds interesting.\n2. Make the mapping explicit and structural: identify what plays the equivalent role of each key component in the source domain, ideally as a short list or table (concept -> analog).\n3. Hold that one domain consistently through the whole explanation rather than stacking several unrelated analogies.\n4. Name at least one place the cross-domain mapping breaks down, so it isn't presented as a perfect correspondence.\n5. Keep the underlying facts about the original topic accurate — the cross-domain framing should illuminate the mechanism, not distort it." },
      { id: 'pareto', name: 'The 80/20 Pareto Guide', desc: 'Skips the fluff and covers only the 20% of concepts that drive 80% of understanding.',
        directive: "Activate The 80/20 Pareto Guide. Identify and explain only the small subset of concepts, facts, or principles that account for the large majority of real understanding or practical competence in this topic.\n\n1. Rank the vital-few concepts by leverage — how much understanding or capability each one unlocks — and lead with the highest-leverage one.\n2. Treat '80/20' as a framing heuristic, not a literal statistic, unless you actually have a real number to cite.\n3. Explicitly list what's being deliberately left out, with a one-line reason it's lower-leverage for a first pass.\n4. Keep the included set genuinely minimal — resist the pull to become comprehensive; comprehensiveness is what this mode exists to avoid.\n5. If the person's specific goal changes what's high-leverage (e.g. passing an exam vs. shipping code), calibrate the selection to that goal when it's inferable." } ] },
    { group: '🧠 Reasoning & Analysis', modes: [
      { id: 'deep-research', name: 'Deep Research Mode', desc: 'Systematic, heavily-structured synthesis from training knowledge, with explicit staleness and confidence flags — not a live web search.',
        directive: "Activate Deep Research Mode. Treat the question as a research brief requiring thoroughness over speed, synthesized from your training knowledge rather than a live search.\n\n1. Break the question into its real sub-questions and address each one systematically, with clear headers for anything long enough to need them.\n2. Cross-check claims for internal consistency — where your own knowledge on a topic conflicts, surface the disagreement explicitly rather than silently picking one side.\n3. Distinguish well-established facts from claims that are genuinely contested or thinly evidenced, and say which is which.\n4. Explicitly flag anything time-sensitive or likely to have changed since your training data — state your uncertainty about current status rather than asserting it with unwarranted confidence.\n5. Be upfront that this is reasoned synthesis from existing knowledge, not a live web search, so the person knows what still needs independent verification.\n6. Close with a short list of the most perishable or highest-stakes claims worth double-checking against a current source." },
      { id: 'chain-of-thought', name: 'Chain-of-Thought (Step-by-Step)', desc: 'Shows full logical or mathematical work before giving the final answer.',
        directive: "Activate Chain-of-Thought Mode. For any question involving reasoning, calculation, or multi-step logic, show the work explicitly and sequentially before stating the final answer.\n\n1. Number or clearly separate each step rather than jumping straight to a conclusion.\n2. Make every inferential leap visible — don't skip from an early step to a much later one without showing what connects them.\n3. Keep the shown reasoning honest: don't pad with extra steps that don't do real work just to look more rigorous.\n4. Flag inline whenever a step depends on an assumption rather than something established.\n5. State the final answer only after the full chain has been shown, clearly marked (e.g. 'Answer:') so it's easy to find." },
      { id: 'devils-advocate', name: 'Devil\u2019s Advocate', desc: 'Actively critiques your ideas, hunts for logical fallacies and risks.',
        directive: "Activate Devil's Advocate Mode. Actively critique the person's stated idea, plan, or claim rather than simply supporting or elaborating on it.\n\n1. Look specifically for logical fallacies, unstated assumptions, weak evidence, and realistic risks or failure scenarios.\n2. State findings directly and specifically — name the exact assumption or risk, not a vague 'there could be issues here'.\n3. Separate fatal flaws that would sink the idea from minor concerns that are worth noting but not disqualifying.\n4. Lead with the single most damaging critique rather than burying it in a list of equally-weighted points.\n5. If the idea is genuinely solid, say so plainly rather than manufacturing weak criticisms just to perform thoroughness — false criticism is as unhelpful as false praise." },
      { id: 'red-team', name: 'Red Team Mode', desc: 'Actively hunts for how a plan, system, or argument could be broken, gamed, or exploited — framed for hardening it, not attacking it.',
        directive: "Activate Red Team Mode. Approach the person's plan, system, or argument as an adversary trying to break it, not a reviewer trying to improve it politely.\n\n1. Identify concrete ways it could be gamed, exploited, misused, or fail under adversarial rather than good-faith conditions — name the exact vector, not 'security could be an issue'.\n2. Rank findings by likelihood times impact, so the most dangerous realistic issue is clearly the headline, not buried in a long list.\n3. Distinguish theoretical weaknesses from ones that are practically exploitable right now.\n4. Keep findings at the level of 'here's the weakness and why it works' — useful for hardening the system — rather than a ready-to-run exploit, attack script, or step-by-step instructions for causing harm.\n5. When a detail would meaningfully help an attacker but isn't needed to understand or fix the weakness, leave it out and say why in one clause." },
      { id: 'probabilistic', name: 'Probabilistic Reasoning', desc: 'Frames claims and predictions with explicit, appropriately-precise confidence levels.',
        directive: "Activate Probabilistic Reasoning Mode. For any claim, prediction, or recommendation made under real uncertainty, attach an explicit confidence level rather than stating it as flatly certain or flatly unknowable.\n\n1. Give either a rough probability ('roughly 70% likely') or a clear qualitative band ('likely', 'a coin flip', 'unlikely but plausible') — pick whichever fits the actual precision of your evidence.\n2. State in one clause what that confidence is based on.\n3. Name the single piece of evidence or event that would most shift the estimate up or down.\n4. Avoid false precision — don't give a decimal-point figure (e.g. '73.2%') for a judgment call that doesn't actually support that precision.\n5. Reserve unqualified 'certain' or 'definitely' language for things that genuinely are — don't launder a strong hunch into false certainty." } ] },
    { group: '🎨 Formatting & Note-Taking', modes: [
      { id: 'brain-dump', name: 'Handwritten Notes / Brain Dump', desc: 'Informal, shorthand notes with bullets, arrows, and casual phrasing.',
        directive: "Activate Handwritten Notes / Brain Dump formatting. Present the content as informal, conversational shorthand notes rather than polished prose.\n\n1. Use short fragments over full sentences wherever a fragment carries the idea.\n2. Use arrows (->) to show relationships, causality, or sequence instead of connective prose.\n3. Use casual phrasing and natural abbreviations, the way someone would scribble while thinking quickly, not formal writing.\n4. Skip a polished intro or outro — start on the first real point and stop after the last one.\n5. Group loosely related items under a short one-word or few-word label instead of a formal heading." },
      { id: 'zettelkasten', name: 'Zettelkasten / Obsidian Mode', desc: 'Atomic, tagged, bidirectionally-linked notes for a personal knowledge base.',
        directive: "Activate Zettelkasten / Obsidian Mode formatting. Structure the response as atomic, self-contained concept notes suitable for a personal knowledge base.\n\n1. One core idea per note — if a note is carrying two ideas, split it into two notes.\n2. Keep each note short, roughly under 100 words, so it stays genuinely atomic rather than a mini-essay.\n3. Use double-bracket wiki-links [[like this]] for any concept, term, or idea that could plausibly be its own linked note.\n4. Add 2-4 relevant #tags per note where useful for later retrieval.\n5. If producing more than a few notes, close with a short 'Map of Content' list linking them together so the set is navigable." },
      { id: 'bluf', name: 'Executive Summary / BLUF', desc: 'Bottom-line-up-front: one-sentence conclusion, 3\u20135 bullets, no preamble.',
        directive: "Activate Executive Summary / BLUF (Bottom Line Up Front) formatting. Strip away background context and scene-setting.\n\n1. Open immediately with the one-sentence bottom-line conclusion or recommendation — no lead-up.\n2. Follow with 3-5 crisp bullet points of the most decision-relevant detail, one line each, no sub-bullets.\n3. Avoid hedging filler in the bullets — each one should carry a real fact or implication, not a caveat.\n4. End on the takeaway itself; don't append exploratory reasoning or extra discussion after the bullets.\n5. If genuinely more nuance exists, offer it as a single optional line ('More detail available if useful') rather than including it by default." } ] },
    { group: '🎭 Personas & Tones', modes: [
      { id: 'eli5', name: 'ELI5 (Explain Like I\u2019m 5)', desc: 'No jargon \u2014 one simple, child-friendly scenario, kept factually accurate.',
        directive: "Activate ELI5 (Explain Like I'm 5) Mode. Avoid all jargon, technical terminology, and formal definitions.\n\n1. Use simple language and one central, concrete, child-friendly scenario — a toy, an animal, an everyday experience — rather than a new analogy per sentence.\n2. Keep the core idea accurate; simplify the presentation, not the truth of what's being said.\n3. If the real answer needs a caveat that the simple version necessarily loses, add one short 'for grown-ups' line at the end rather than complicating the main explanation.\n4. Keep the tone warm and simple without being condescending — the actual reader is an adult who asked for a simple explanation, not a child." },
      { id: 'socratic', name: 'The Socratic Guide', desc: 'Answers mainly with one guiding question at a time, to build the answer with you.',
        directive: "Activate The Socratic Guide. Instead of directly explaining the answer, guide the person toward it primarily through a sequence of targeted questions.\n\n1. Ask exactly one guiding question per turn — never stack multiple questions in the same message.\n2. Build each next question directly on the person's actual previous answer, not a pre-planned script.\n3. Narrow progressively: start broad, tighten toward the specific insight with each exchange.\n4. If an answer reveals a misconception, ask a question that exposes the gap rather than stating the correction outright.\n5. Give the direct answer after two genuine attempts, or immediately if the person explicitly asks for it — don't withhold it indefinitely in the name of the method." } ] },
    { group: '🛠️ Iteration & Precision', modes: [
      { id: 'terse', name: 'Terse Mode', desc: 'Strips every response to the fewest words that still fully answer the question.',
        directive: "Activate Terse Mode. Compress every response to the fewest words that still fully and correctly answer the question.\n\n1. Cut all hedging, framing, and restating of the question before answering it.\n2. Prefer fragments and short declarative sentences over flowing prose.\n3. Use a list instead of prose whenever the list is shorter and loses nothing.\n4. Never add a closing line, offer, or summary — stop the instant the answer is complete.\n5. Terse does not mean incomplete: cut words, not content the answer actually needs to be correct." },
      { id: 'show-work', name: 'Show Your Work', desc: 'Never states a derived number or claim without the calculation, reasoning, or basis behind it.',
        directive: "Activate Show Your Work Mode. Whenever a response includes a number, calculation, or claim that was derived rather than trivially known, show the actual steps behind it.\n\n1. For calculations, show the arithmetic or formula applied, not just the result.\n2. For derived conclusions, show the actual reasoning chain that produced them.\n3. For factual claims recalled rather than derived, say plainly that it's recalled from training knowledge, and flag it explicitly if it's the kind of fact that could have changed or be misremembered.\n4. If a claim can't be traced to a clear derivation or firm basis, say so directly instead of presenting it as settled." } ] }
  ];
  const MODE_DIRECTIVES = {};
  const MODE_NAMES = {};
  MODE_DEFS.forEach(g => g.modes.forEach(m => { MODE_DIRECTIVES[m.id] = m.directive; MODE_NAMES[m.id] = m.name; }));

  // per-conversation active mode ids; migrates lazily via getActiveModes()
  function getActiveModes(c){
    if (!c) return [];
    if (!Array.isArray(c.modes)) return [];
    return c.modes.filter(id => MODE_DIRECTIVES[id]);
  }
  let modesDraft = []; // working selection while the modal is open, applied to the convo on Save

  function renderModesModal(){
    if (!els.modesBody) return;
    els.modesBody.innerHTML = '';
    MODE_DEFS.forEach(g => {
      const group = document.createElement('div');
      group.className = 'modes-group';
      const title = document.createElement('div');
      title.className = 'modes-group-title';
      title.textContent = g.group;
      group.appendChild(title);
      const grid = document.createElement('div');
      grid.className = 'modes-grid';
      g.modes.forEach(m => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'mode-card' + (modesDraft.includes(m.id) ? ' active' : '');
        card.dataset.id = m.id;
        card.innerHTML = `<span class="mchk"><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0d0d0d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <span class="mbody"><span class="mname">${m.name}</span><span class="mdesc">${m.desc}</span></span>`;
        card.addEventListener('click', () => {
          const i = modesDraft.indexOf(m.id);
          if (i === -1) modesDraft.push(m.id); else modesDraft.splice(i, 1);
          card.classList.toggle('active');
        });
        grid.appendChild(card);
      });
      group.appendChild(grid);
      els.modesBody.appendChild(group);
    });
  }

  function syncModesToggle(){
    const c = getActive();
    const active = getActiveModes(c);
    if (!els.modesToggle) return;
    els.modesToggle.classList.toggle('on', active.length > 0);
    if (els.modesLabel) {
      els.modesLabel.textContent = active.length === 0 ? 'Modes'
        : active.length === 1 ? MODE_NAMES[active[0]]
        : active.length + ' modes';
    }
    if (els.modesCount) {
      els.modesCount.style.display = active.length > 1 ? 'inline-block' : 'none';
      els.modesCount.textContent = String(active.length);
    }
    els.modesToggle.title = active.length > 0
      ? active.map(id => MODE_NAMES[id]).join(', ') + ' \u2014 click to edit'
      : 'Response modes \u2014 layer extra behaviors onto every answer';
  }

  function openModesModal(){
    const c = ensureActiveConversation();
    modesDraft = getActiveModes(c).slice();
    renderModesModal();
    els.modesOverlay.classList.add('show');
  }
  function closeModesModal(){ els.modesOverlay.classList.remove('show'); }

  if (els.modesToggle) els.modesToggle.addEventListener('click', openModesModal);
  if (els.modesClose) els.modesClose.addEventListener('click', closeModesModal);
  if (els.modesCancelBtn) els.modesCancelBtn.addEventListener('click', closeModesModal);
  if (els.modesOverlay) els.modesOverlay.addEventListener('click', (e) => { if (e.target === els.modesOverlay) closeModesModal(); });
  if (els.modesClearBtn) els.modesClearBtn.addEventListener('click', () => { modesDraft = []; renderModesModal(); });
  if (els.modesSaveBtn) els.modesSaveBtn.addEventListener('click', () => {
    const c = ensureActiveConversation();
    c.modes = modesDraft.slice();
    lastModes = modesDraft.slice(); // sticky default for the next new chat, until changed again
    persistAll();
    syncModesToggle();
    closeModesModal();
    showToast(modesDraft.length > 0 ? modesDraft.length + ' mode' + (modesDraft.length === 1 ? '' : 's') + ' applied' : 'Modes cleared');
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && els.modesOverlay && els.modesOverlay.classList.contains('show')) closeModesModal(); });

  // builds the system-message array (custom system prompt + active response modes)
  // shared by the main chat send path and the side chat.
  function buildSystemMessages(convo){
    const sys = [];
    if (applied.system.trim()) sys.push(applied.system.trim());
    const activeModes = getActiveModes(convo);
    // Modes are designed to stack, but two active modes can genuinely disagree on format
    // (e.g. Terse wants minimum words, Mastery wants a six-stage breakdown). Without guidance
    // the model tends to silently drop one mode rather than reconcile them, which defeats the
    // point of stacking. This also has to explicitly tell the model to override the *established
    // tone of the conversation so far* — if a mode gets turned on mid-thread, the model otherwise
    // tends to keep pattern-matching the denser style of earlier replies instead of actually
    // switching, since prior turns are a stronger signal than a single system message.
    if (activeModes.length) {
      const names = activeModes.map(id => MODE_NAMES[id]).join(', ');
      let meta = "The following response mode" + (activeModes.length > 1 ? 's are' : ' is') + " active for this chat: " + names + ". Apply " + (activeModes.length > 1 ? 'them' : 'it') +
        " fully starting with your very next reply — even if earlier replies in this conversation were written in a denser, more technical, or otherwise different style. A mode being turned on mid-conversation should visibly and immediately change how you respond; do not ease into it or keep the prior tone out of consistency with earlier turns.";
      if (activeModes.length > 1) {
        meta += " None of the active modes takes precedence over the others by default. Where two of them make a genuinely incompatible formatting demand on the same response (for example, one calls for minimum length while another calls for a multi-stage structure, or one wants prose while another wants notes), do not silently drop one mode and follow the other. Instead, satisfy the substantive intent of every mode within a single coherent response: compress the structure the more elaborate mode asks for down to its essentials rather than omitting it, and keep the discipline the more minimal mode asks for within whatever structure remains. Where modes don't conflict, just apply all of them at once.";
      }
      sys.push(meta);
    }
    activeModes.forEach(id => sys.push(MODE_DIRECTIVES[id]));
    return sys;
  }

  /* ---------------- CFA topic outline browser ---------------- */
  // Parsed from CFA-2026-L1-Topic-Outline-Detailed.md: 10 volumes, 94 learning modules.
  // Selecting a module sends a detailed-explanation request into the main chat, using
  // whatever provider/model/modes are already configured — this feature is purely a
  // structured, one-click way to compose that request, not a separate code path.
  const OUTLINE_DATA = [{"volNum": 1, "volTitle": "Quantitative Methods", "modules": [{"modNum": 1, "modTitle": "Rates and Returns", "id": "v1m1", "sections": ["Interest Rates And Time Value Of Money", "Rates Of Return", "Money-Weighted And Time-Weighted Return", "Annualized Return", "Other Major Return Measures And Their Applications"]}, {"modNum": 2, "modTitle": "Time Value of Money in Finance", "id": "v1m2", "sections": ["Time Value Of Money In Fixed Income And Equity", "Implied Return And Growth", "Cash Flow Additivity"]}, {"modNum": 3, "modTitle": "Statistical Measures of Asset Returns", "id": "v1m3", "sections": ["Measures Of Central Tendency And Location", "Measures Of Dispersion", "Measures Of Shape Of A Distribution", "Correlation Between Two Variables"]}, {"modNum": 4, "modTitle": "Probability Trees and Conditional Expectations", "id": "v1m4", "sections": ["Expected Value And Variance", "Probability Trees And Conditional Expectations", "Bayes' Formula And Updating Probability Estimates"]}, {"modNum": 5, "modTitle": "Portfolio Mathematics", "id": "v1m5", "sections": ["Portfolio Expected Return And Variance Of Return", "Function"]}, {"modNum": 6, "modTitle": "Simulation Methods", "id": "v1m6", "sections": ["Lognormal Distribution And Continuous Compounding", "Monte Carlo Simulation", "Bootstrapping"]}, {"modNum": 7, "modTitle": "Estimation and Inference", "id": "v1m7", "sections": ["Sampling Methods", "Central Limit Theorem And Inference", "Bootstrapping And Empirical Sampling Distributions"]}, {"modNum": 8, "modTitle": "Hypothesis Testing", "id": "v1m8", "sections": ["Hypothesis Tests For Finance", "Tests Of Return And Risk In Finance", "Parametric Versus Nonparametric Tests"]}, {"modNum": 9, "modTitle": "Parametric and Non-Parametric Tests of Independence", "id": "v1m9", "sections": ["Tests Concerning Correlation", "Tests Of Independence Using Contingency Table Data"]}, {"modNum": 10, "modTitle": "Simple Linear Regression", "id": "v1m10", "sections": ["Estimation Of The Simple Linear Regression Model", "Assumptions Of The Simple Linear Regression Model", "Hypothesis Tests In The Simple Linear Regression Model", "Prediction In The Simple Linear Regression Model", "Functional Forms For Simple Linear Regression"]}, {"modNum": 11, "modTitle": "Introduction to Big Data Techniques", "id": "v1m11", "sections": ["Tackling Big Data With Data Science"]}, {"modNum": 12, "modTitle": "Appendices A-E", "id": "v1m12", "sections": ["Appendices A-E"]}]}, {"volNum": 2, "volTitle": "Economics", "modules": [{"modNum": 1, "modTitle": "The Firm and Market Structures", "id": "v2m1", "sections": ["Introduction To Market Structures", "Monopolistic Competition", "Oligopoly", "Determining Market Structure"]}, {"modNum": 2, "modTitle": "Understanding Business Cycles", "id": "v2m2", "sections": ["Overview Of The Business Cycle", "Credit Cycles", "Economic Indicators Over The Business Cycle"]}, {"modNum": 3, "modTitle": "Fiscal Policy", "id": "v2m3", "sections": ["Introduction To Monetary And Fiscal Policy", "Roles And Objectives Of Fiscal Policy", "Fiscal Policy Tools", "Fiscal Policy Implementation"]}, {"modNum": 4, "modTitle": "Monetary Policy", "id": "v2m4", "sections": ["Role Of Central Banks", "Monetary Policy Tools And Monetary Transmission", "Monetary Policy Objectives", "Interaction Of Monetary And Fiscal Policy"]}, {"modNum": 5, "modTitle": "Introduction to Geopolitics", "id": "v2m5", "sections": ["National Governments And Political Cooperation", "Forces Of Globalization", "International Trade Organizations", "Assessing Geopolitical Actors And Risk", "The Tools Of Geopolitics", "Geopolitical Risk And The Investment Process"]}, {"modNum": 6, "modTitle": "International Trade", "id": "v2m6", "sections": ["Benefits And Costs Of Trade", "Trading Blocs And Regional Integration"]}, {"modNum": 7, "modTitle": "Capital Flows and the FX Market", "id": "v2m7", "sections": ["The Foreign Exchange Market And Exchange Rates", "Capital Restrictions"]}, {"modNum": 8, "modTitle": "Exchange Rate Calculations", "id": "v2m8", "sections": ["Cross-Rate Calculations", "Forward Rate Calculations", "Glossary"]}]}, {"volNum": 3, "volTitle": "Corporate Issuers", "modules": [{"modNum": 1, "modTitle": "Organizational Forms, Corporate Issuer Features, and Ownership", "id": "v3m1", "sections": ["Organizational Forms Of Businesses", "Key Features Of Corporate Issuers", "Publicly Vs. Privately Owned Corporate", "Issuers"]}, {"modNum": 2, "modTitle": "Investors and Other Stakeholders", "id": "v3m2", "sections": ["Financial Claims Of Lenders And Shareholders", "Corporate Stakeholders And Governance", "Corporate ESG Considerations"]}, {"modNum": 3, "modTitle": "Corporate Governance: Conflicts, Mechanisms, Risks, and Benefits", "id": "v3m3", "sections": ["Stakeholder Conflicts And Management", "Corporate Governance Mechanisms", "Corporate Governance Risks And Benefits"]}, {"modNum": 4, "modTitle": "Working Capital and Liquidity", "id": "v3m4", "sections": ["Cash Conversion Cycle", "Liquidity", "Managing Working Capital And Liquidity"]}, {"modNum": 5, "modTitle": "Capital Investments and Capital Allocation", "id": "v3m5", "sections": ["Capital Investments", "Capital Allocation", "Capital Allocation Principles And Pitfalls", "Real Options"]}, {"modNum": 6, "modTitle": "Capital Structure", "id": "v3m6", "sections": ["The Cost Of Capital", "Factors Affecting Capital Structure", "Propositions", "Optimal Capital Structure"]}, {"modNum": 7, "modTitle": "Business Models", "id": "v3m7", "sections": ["Defining The Business Model", "Business Model Types"]}]}, {"volNum": 4, "volTitle": "Financial Statement Analysis", "modules": [{"modNum": 1, "modTitle": "Introduction to Financial Statement Analysis", "id": "v4m1", "sections": ["Financial Statement Analysis Framework", "Scope Of Financial Statement Analysis", "Regulated Sources Of Information", "Comparison Of Ifrs With Alternative", "Financial Reporting Systems", "Other Sources Of Information"]}, {"modNum": 2, "modTitle": "Analyzing Income Statements", "id": "v4m2", "sections": ["Revenue Recognition", "Expense Recognition", "Non-Recurring Items", "Earnings Per Share", "Income Statement Ratios And Common-Size", "Analysis"]}, {"modNum": 3, "modTitle": "Analyzing Balance Sheets", "id": "v4m3", "sections": ["Intangible Assets", "Goodwill", "Financial Instruments", "Non-Current Liabilities", "Ratios And Common-Size Analysis"]}, {"modNum": 4, "modTitle": "Analyzing Statements of Cash Flows I", "id": "v4m4", "sections": ["Linkages Between The Financial Statements", "The Direct Method For Cash Flows From", "Operating Activities", "The Indirect Method For Cash Flows From", "Conversion From The Indirect To Direct", "Method", "Cash Flows From Investing Activities", "Cash Flows From Financing Activities", "Differences In Cash Flow Statements", "Prepared Under Us Gaap Versus Ifrs"]}, {"modNum": 5, "modTitle": "Analyzing Statements of Cash Flows II", "id": "v4m5", "sections": ["Evaluating Sources And Uses Of Cash", "Ratios And Common-Size Analysis", "Free Cash Flow Measures", "Ratios"]}, {"modNum": 6, "modTitle": "Analysis of Inventories", "id": "v4m6", "sections": ["Inventory Valuation", "The Effects Of Inflation And Deflation On", "Presentation And Disclosure"]}, {"modNum": 7, "modTitle": "Analysis of Long-Term Assets", "id": "v4m7", "sections": ["Acquisition Of Intangible Assets", "Impairment And Derecognition Of Assets", "Presentation And Disclosure", "Using Disclosures In Analysis"]}, {"modNum": 8, "modTitle": "Topics in Long-Term Liabilities and Equity", "id": "v4m8", "sections": ["Leases", "Financial Reporting For Postemployment And Share-Based Compensation Plans", "Presentation And Disclosure"]}, {"modNum": 9, "modTitle": "Analysis of Income Taxes", "id": "v4m9", "sections": ["Differences Between Accounting Profit And Taxable Income", "Deferred Tax Assets And Liabilities", "Corporate Income Tax Rates", "Presentation And Disclosure"]}, {"modNum": 10, "modTitle": "Financial Reporting Quality", "id": "v4m10", "sections": ["Conceptual Overview", "Biased Accounting Choices", "Departures From Gaap", "Differentiate Between Conservative And Aggressive Accounting", "Context For Assessing Financial Reporting", "Quality", "Mechanisms That Discipline Financial", "Reporting Quality", "Detection Of Financial Reporting Quality", "Accounting Choices And Estimates", "Accounting Choices That Affect The Cash", "Flow Statement", "Accounting Choices That Affect Financial", "Reporting", "Warning Signs"]}, {"modNum": 11, "modTitle": "Financial Analysis Techniques", "id": "v4m11", "sections": ["The Financial Analysis Process", "Analytical Tools And Techniques", "Financial Ratio Analysis", "Common Size Balance Sheets And Income", "Statements", "Relationships In Financial Statements", "And Context", "Activity Ratios", "Liquidity Ratios", "Solvency Ratios", "Profitability Ratios", "Integrated Financial Ratio Analysis", "Industry-Specific Financial Ratios", "Model Building And Forecasting"]}, {"modNum": 12, "modTitle": "Introduction to Financial Statement Modeling", "id": "v4m12", "sections": ["Building A Financial Statement Model", "Behavioral Finance And Analyst Forecasts", "The Impact Of Competitive Factors In Prices", "And Costs", "Modeling Inflation And Deflation", "The Forecast Horizon And Long-Term", "Forecasting"]}]}, {"volNum": 5, "volTitle": "Equity Investments", "modules": [{"modNum": 1, "modTitle": "Market Organization and Structure", "id": "v5m1", "sections": ["The Functions Of The Financial System", "Assets And Contracts", "Securities", "Contracts", "Financial Intermediaries", "Settlement And Custodial Services And Summary", "Positions And Short Positions", "Leveraged Positions", "Orders And Execution Instructions", "Validity Instructions And Clearing Instructions", "Primary Security Markets", "Secondary Security Market And Contract Market Structures", "Well-Functioning Financial Systems", "Market Regulation", "Summary"]}, {"modNum": 2, "modTitle": "Security Market Indexes", "id": "v5m2", "sections": ["Index Definition And Calculations Of Value And Returns", "Index Construction", "Uses Of Market Indexes", "Equity Indexes", "Fixed-Income Indexes", "Indexes For Alternative Investments", "Summary"]}, {"modNum": 3, "modTitle": "Market Efficiency", "id": "v5m3", "sections": ["The Concept Of Market Efficiency", "Factors Affecting Market Efficiency Including Trading Costs", "Forms Of Market Efficiency", "Implications Of The Efficient Market Hypothesis", "Market Pricing Anomalies-Time Series And Cross-Sectional", "Behavioral Finance", "Summary"]}, {"modNum": 4, "modTitle": "Overview of Equity Securities", "id": "v5m4", "sections": ["Importance Of Equity Securities", "Characteristics Of Equity Securities", "Private Versus Public Equity Securities", "Non-Domestic Equity Securities", "Risk And Return Characteristics", "Equity And Company Value", "Summary"]}, {"modNum": 5, "modTitle": "Company Analysis: Past and Present", "id": "v5m5", "sections": ["Company Research Reports", "Determining The Business Model", "Revenue Analysis", "Capital Investments And Capital Structure"]}, {"modNum": 6, "modTitle": "Industry and Competitive Analysis", "id": "v5m6", "sections": ["Uses Of Industry Analysis", "Industry Classification", "Industry Survey", "Industry Structure And External Influences", "Competitive Positioning"]}, {"modNum": 7, "modTitle": "Company Analysis: Forecasting", "id": "v5m7", "sections": ["Forecasting Revenues", "Forecasting Operating Expenses And Working Capital", "Forecasting Capital Investments And Capital Structure", "Scenario Analysis"]}, {"modNum": 8, "modTitle": "Equity Valuation: Concepts and Basic Tools", "id": "v5m8", "sections": ["Estimated Value And Market Price", "Categories Of Equity Valuation Models", "Background For The Dividend Discount Model", "Dividend Discount Model (Ddm) And Free-Cash-Flow-To-Equity Model (Fcfe)", "Preferred Stock Valuation", "The Gordon Growth Model", "Multistage Dividend Discount Models", "Fundamentals", "Method Of Comparables And Valuation Based On Price Multiples", "Enterprise Value", "Asset-Based Valuation", "Summary"]}]}, {"volNum": 6, "volTitle": "Fixed Income", "modules": [{"modNum": 1, "modTitle": "Fixed-Income Instrument Features", "id": "v6m1", "sections": ["Features Of Fixed-Income Securities", "Bond Indentures And Covenants"]}, {"modNum": 2, "modTitle": "Fixed-Income Cash Flows and Types", "id": "v6m2", "sections": ["Fixed-Income Cash Flow Structures", "Fixed-Income Contingency Provisions"]}, {"modNum": 3, "modTitle": "Fixed-Income Issuance and Trading", "id": "v6m3", "sections": ["Fixed-Income Indexes", "Primary And Secondary Fixed-Income Markets"]}, {"modNum": 4, "modTitle": "Fixed-Income Markets for Corporate Issuers", "id": "v6m4", "sections": ["Short-Term Funding Alternatives", "Repurchase Agreements", "Long-Term Corporate Debt"]}, {"modNum": 5, "modTitle": "Fixed-Income Markets for Government Issuers", "id": "v6m5", "sections": ["Sovereign Debt", "Sovereign Debt Issuance And Trading"]}, {"modNum": 6, "modTitle": "Fixed-Income Bond Valuation: Prices and Yields", "id": "v6m6", "sections": ["Bond Pricing And The Time Value Of Money", "Relationships Between Bond Prices And Bond Features", "Matrix Pricing"]}, {"modNum": 7, "modTitle": "Yield and Yield Spread Measures for Fixed-Rate Bonds", "id": "v6m7", "sections": ["Periodicity And Annualized Yields", "Yield Spread Measures For Fixed-Rate Bonds And Matrix Pricing"]}, {"modNum": 8, "modTitle": "Yield and Yield Spread Measures for Floating-Rate Instruments", "id": "v6m8", "sections": ["Yield And Yield Spread Measures For Floating-Rate Notes", "Yield Measures For Money Market Instruments"]}, {"modNum": 9, "modTitle": "The Term Structure of Interest Rates: Spot, Par, and Forward Curves", "id": "v6m9", "sections": ["Maturity Structure Of Interest Rates And Spot Rates", "Par And Forward Rates"]}, {"modNum": 10, "modTitle": "Interest Rate Risk and Return", "id": "v6m10", "sections": ["Sources Of Return From Investing In A Fixed-Rate Bond", "Investment Horizon And Interest Rate Risk", "Macaulay Duration"]}, {"modNum": 11, "modTitle": "Yield-Based Bond Duration Measures and Properties", "id": "v6m11", "sections": ["Modified Duration", "Money Duration And Price Value Of A Basis Point", "Properties Of Duration"]}, {"modNum": 12, "modTitle": "Yield-Based Bond Convexity and Portfolio Properties", "id": "v6m12", "sections": ["Bond Convexity And Convexity Adjustment", "Bond Risk And Return Using Duration And Convexity", "Portfolio Duration And Convexity"]}, {"modNum": 13, "modTitle": "Curve-Based and Empirical Fixed-Income Risk Measures", "id": "v6m13", "sections": ["Curve-Based Interest Rate Risk Measures", "Bond Risk And Return Using Curve-Based Duration And Convexity", "Key Rate Duration As A Measure Of Yield Curve Risk", "Empirical Duration"]}, {"modNum": 14, "modTitle": "Credit Risk", "id": "v6m14", "sections": ["Sources Of Credit Risk", "Credit Rating Agencies And Credit Ratings", "Factors Impacting Yield Spreads"]}, {"modNum": 15, "modTitle": "Credit Analysis for Government Issuers", "id": "v6m15", "sections": ["Sovereign Credit Analysis", "Non-Sovereign Credit Risk"]}, {"modNum": 16, "modTitle": "Credit Analysis for Corporate Issuers", "id": "v6m16", "sections": ["Assessing Corporate Creditworthiness", "Financial Ratios In Corporate Credit Analysis"]}, {"modNum": 17, "modTitle": "Fixed-Income Securitization", "id": "v6m17", "sections": ["The Benefits Of Securitization", "The Securitization Process"]}, {"modNum": 18, "modTitle": "Asset-Backed Security (ABS) Instrument and Market Features", "id": "v6m18", "sections": ["Covered Bonds", "ABS Structures To Address Credit Risk", "Non-Mortgage Asset-Backed Securities", "Collateralized Debt Obligations"]}, {"modNum": 19, "modTitle": "Mortgage-Backed Security (MBS) Instrument and Market Features", "id": "v6m19", "sections": ["Time Tranching", "Mortgage Loans And Their Characteristic Features", "Residential Mortgage-Backed Securities (Rmbs)", "Commercial Mortgage-Backed Securities (Cmbs)"]}]}, {"volNum": 7, "volTitle": "Derivatives", "modules": [{"modNum": 1, "modTitle": "Derivative Instrument and Derivative Market Features", "id": "v7m1", "sections": ["Derivative Features", "Derivative Underlyings", "Derivative Markets"]}, {"modNum": 2, "modTitle": "Forward Commitment and Contingent Claim Features and Instruments", "id": "v7m2", "sections": ["Futures", "Swaps", "Options", "Credit Derivatives", "Forward Commitments Vs. Contingent Claims"]}, {"modNum": 3, "modTitle": "Derivative Benefits, Risks, and Issuer and Investor Uses", "id": "v7m3", "sections": ["Derivative Benefits", "Derivative Risks", "Issuer Use Of Derivatives", "Investor Use Of Derivatives"]}, {"modNum": 4, "modTitle": "Arbitrage, Replication, and the Cost of Carry in Pricing Derivatives", "id": "v7m4", "sections": ["Arbitrage", "Replication", "Costs And Benefits Associated With Owning The Underlying"]}, {"modNum": 5, "modTitle": "Pricing and Valuation of Forward Contracts and for an Underlying", "id": "v7m5", "sections": ["with Varying Maturities", "Pricing And Valuation Of Forward Contracts", "Pricing And Valuation Of Interest Rate Forward Contracts"]}, {"modNum": 6, "modTitle": "Pricing and Valuation of Futures Contracts", "id": "v7m6", "sections": ["Pricing Of Futures Contracts At Inception", "Interest Rate Futures Versus Forward Contracts", "Forward And Futures Price Differences", "Interest Rate Forward And Futures Price Differences", "Effect Of Central Clearing Of Otc Derivatives"]}, {"modNum": 7, "modTitle": "Pricing and Valuation of Interest Rates and Other Swaps", "id": "v7m7", "sections": ["Swaps Vs. Forwards", "Swap Values And Prices"]}, {"modNum": 8, "modTitle": "Pricing and Valuation of Options", "id": "v7m8", "sections": ["Option Value Relative To The Underlying Spot Price", "Option Exercise Value", "Option Moneyness", "Option Time Value", "Arbitrage", "Replication", "Factors Affecting Option Value"]}, {"modNum": 9, "modTitle": "Option Replication Using Put–Call Parity", "id": "v7m9", "sections": []}, {"modNum": 10, "modTitle": "Valuing a Derivative Using a One-Period Binomial Model", "id": "v7m10", "sections": ["Binomial Valuation", "The Binomial Model", "Pricing A European Call Option", "Risk Neutrality"]}]}, {"volNum": 8, "volTitle": "Alternative Investments", "modules": [{"modNum": 1, "modTitle": "Alternative Investment Features, Methods, and Structures", "id": "v8m1", "sections": ["Alternative Investment Features", "Alternative Investment Methods", "Alternative Investment Structures"]}, {"modNum": 2, "modTitle": "Alternative Investment Performance and Returns", "id": "v8m2", "sections": ["Alternative Investment Performance", "Alternative Investment Returns"]}, {"modNum": 3, "modTitle": "Investments in Private Capital: Equity and Debt", "id": "v8m3", "sections": ["Private Equity Investment Characteristics", "Private Debt Investment Characteristics", "Diversification Benefits Of Private Capital"]}, {"modNum": 4, "modTitle": "Real Estate and Infrastructure", "id": "v8m4", "sections": ["Real Estate Features", "Real Estate Investment Characteristics", "Infrastructure Investment Features", "Infrastructure Investment Characteristics"]}, {"modNum": 5, "modTitle": "Natural Resources", "id": "v8m5", "sections": ["Natural Resources Investment Features", "Commodity Investment Forms", "And Diversification"]}, {"modNum": 6, "modTitle": "Hedge Funds", "id": "v8m6", "sections": ["Hedge Fund Investment Features", "Hedge Fund Investment Forms", "Diversification"]}, {"modNum": 7, "modTitle": "Introduction to Digital Assets", "id": "v8m7", "sections": ["Distributed Ledger Technology", "Digital Asset Investment Features", "Digital Asset Investment Forms", "Diversification"]}]}, {"volNum": 9, "volTitle": "Portfolio Management", "modules": [{"modNum": 1, "modTitle": "Portfolio Risk and Return: Part I", "id": "v9m1", "sections": ["Historical Return And Risk", "Other Investment Characteristics", "Risk Aversion And Portfolio Selection", "Utility Theory And Indifference Curves", "Application Of Utility Theory To Portfolio Selection", "Portfolio Risk & Portfolio Of Two Risky Assets", "Portfolio Of Many Risky Assets", "The Power Of Diversification", "Summary"]}, {"modNum": 2, "modTitle": "Portfolio Risk and Return: Part II", "id": "v9m2", "sections": ["Systematic And Nonsystematic Risk", "Return Generating Models", "Calculation And Interpretation Of Beta", "Portfolio Performance Appraisal Measures", "Applications Of The Capm In Portfolio Construction", "Summary"]}, {"modNum": 3, "modTitle": "Portfolio Management: An Overview", "id": "v9m3", "sections": ["Theory", "Steps In The Portfolio Management Process", "Types Of Investors", "The Asset Management Industry", "Pooled Interest-Mutual Funds", "Pooled Interest-Type Of Mutual Funds", "Pooled Interest-Other Investment Products", "Summary"]}, {"modNum": 4, "modTitle": "Basics of Portfolio Planning and Construction", "id": "v9m4", "sections": ["The Investment Policy Statement", "IPS Risk And Return Objectives", "IPS Constraints", "Gathering Client Information", "Portfolio Construction And Capital Market Expectations", "Strategic Asset Allocation", "Portfolio Construction Principles", "ESG Considerations In Portfolio Planning And Construction", "Summary"]}, {"modNum": 5, "modTitle": "The Behavioral Biases of Individuals", "id": "v9m5", "sections": ["Behavioral Bias Categories", "Cognitive Errors", "Emotional Biases", "Behavioral Finance And Market Behavior", "Summary"]}, {"modNum": 6, "modTitle": "Introduction to Risk Management", "id": "v9m6", "sections": ["Risk Management Process", "Risk Management Framework", "Risk Governance-An Enterprise View", "Risk Tolerance", "Risk Budgeting", "Identification Of Risk-Financial Vs. Non-Financial Risk", "Interactions Between Risks", "Summary"]}]}, {"volNum": 10, "volTitle": "Ethics and Professional Standards", "modules": [{"modNum": 1, "modTitle": "Ethics and Trust in the Investment Profession", "id": "v10m1", "sections": ["Ethics", "Ethics And Professionalism", "Challenges To Ethical Conduct", "Ethical Vs. Legal Standards", "Ethical Decision-Making Frameworks", "Conclusion", "Summary"]}, {"modNum": 2, "modTitle": "Code of Ethics and Standards of Professional Conduct", "id": "v10m2", "sections": ["Preface", "Ethics And The Investment Industry", "CFA Institute Code Of Ethics And Standards", "Of Professional Conduct"]}, {"modNum": 3, "modTitle": "Guidance for Standards I–VII", "id": "v10m3", "sections": ["Standard I(B) Independence And Objectivity", "Standard I(C) Misrepresentation", "Standard I(D) Misconduct", "Standard I(E) Competence", "Standard II(B) Market Manipulation", "Standard III(B) Fair Dealing", "Standard III(C) Suitability", "Standard III(D) Performance Presentation", "Standard III(E) Preservation Of Confidentiality", "Standard IV(B) Additional Compensation", "Arrangements", "Standard IV(C) Responsibilities Of Supervisors", "Standard V(B) Communication With Clients", "And Prospective Clients", "Standard V(C) Record Retention", "Standard VI(B) Priority Of Transactions", "Standard VI(C) Referral Fees", "Institute Member Or CFA Candidate"]}, {"modNum": 4, "modTitle": "Introduction to the Global Investment Performance Standards (GIPS)", "id": "v10m4", "sections": ["Composites", "Fundamentals Of Compliance", "Verification"]}, {"modNum": 5, "modTitle": "Ethics Application", "id": "v10m5", "sections": ["Professionalism", "Integrity Of Capital Markets", "Duties To Clients", "Duties To Employers", "Actions", "Conflicts Of Interest", "Responsibilities As A CFA Institute Member Or CFA Candidate"]}]}];

  const TOPIC_DEPTH_LABEL = { standard: 'Standard depth', advanced: 'Advanced depth', mastery: 'Full mastery walkthrough' };

  // Small deterministic "seeded shuffle" so the generated study notes don't read identically
  // every time you click the same topic, without needing any randomness that breaks re-renders.
  function seededPick(list, seedStr, n){
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
    const rnd = () => { seed = (seed * 1103515245 + 12345) >>> 0; return seed / 4294967295; };
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr.slice(0, n);
  }

  // A short library of exam-craft angles, phrased generically enough to apply to any CFA Level I
  // subtopic, used to build "what the exam tends to test" and "common mistakes" sections without
  // needing a live model call. This is intentionally generic scaffolding, not fabricated specific
  // facts about the topic — the goal is a genuinely useful study-structure, not invented content.
  const EXAM_ANGLES = [
    'the exact definitions and how they differ from similar-sounding terms elsewhere in the curriculum',
    'which direction a value moves when one input changes, holding everything else constant',
    'correctly identifying which formula or method applies given the specific facts in the vignette',
    'unit and sign errors — especially percentage vs. decimal, and per-period vs. annualized figures',
    'distinguishing a rule that holds generally from one that only holds under stated assumptions',
    'reading the vignette carefully enough to catch a single qualifying phrase that changes the right answer',
    'confusing a numerator/denominator relationship, so the ratio moves the opposite way from intuition',
    'applying a US GAAP treatment where IFRS applies, or vice versa, when the vignette specifies one',
    'the difference between a point-in-time measure and a measure computed over a period',
    'mixing up two closely related terms that sound interchangeable but are tested as distinct concepts'
  ];

  const MISCONCEPTIONS = [
    'treating a simplifying assumption used to introduce the concept as if it always holds in practice',
    'assuming a relationship that holds on average also holds for every individual case in the vignette',
    'over-generalizing a rule from the single worked example most textbooks use to teach it',
    'forgetting that a measure can behave differently at the extremes than it does near the middle of its range',
    'not checking whether the question is asking for the concept itself or for how to interpret a change in it'
  ];

  const CONNECTIONS_BY_VOLUME = {
    'Quantitative Methods': 'the statistical and probability tools introduced here reappear directly inside Portfolio Management (risk/return math) and show up implicitly whenever a vignette asks you to interpret a sample statistic.',
    'Economics': 'these macro and market-structure ideas resurface when Fixed Income discusses interest-rate policy transmission and when Equity Investments discusses industry structure.',
    'Corporate Issuers': 'capital structure and governance concepts here connect directly to Financial Statement Analysis (how the choices show up in the statements) and to Equity Valuation (how they affect required return).',
    'Financial Statement Analysis': 'ratios and adjustments introduced here are the direct inputs to Equity Valuation and to the credit-analysis modules in Fixed Income.',
    'Equity Investments': 'valuation concepts here are a prerequisite for Portfolio Management\'s discussion of expected return, and market-structure ideas connect back to Quantitative Methods\' treatment of returns.',
    'Fixed Income': 'duration, convexity, and credit-spread ideas here are the fixed-income half of the risk measures Portfolio Management uses when building a multi-asset portfolio.',
    'Derivatives': 'the no-arbitrage and replication logic here is the same logic used implicitly in Fixed Income\'s forward-rate material and in Equity\'s treatment of implied return.',
    'Alternative Investments': 'the return and risk characteristics here get folded into Portfolio Management\'s diversification and asset-allocation discussion.',
    'Portfolio Management': 'this module sits downstream of Quantitative Methods (the statistics), Equity and Fixed Income (the asset-level inputs), and Alternative Investments (the diversifying assets).',
    'Ethics and Professional Standards': 'the Standards are tested throughout the exam, not just in the Ethics section — vignettes elsewhere can still turn on an ethics judgment layered on top of the technical material.'
  };

  function escapeHtmlLocal(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  // Builds a complete, well-structured study explanation entirely from the embedded curriculum
  // outline — no network call, no API key, no backend. This is what makes the Topics feature work
  // identically on a fully static host (GitHub Pages, Cloudflare Pages) with zero configuration.
  function generateTopicExplanation(volTitle, modTitle, sections, depth, sectionTitle){
    const seedBase = volTitle + '|' + modTitle + '|' + (sectionTitle || '');
    const scopeLabel = sectionTitle ? `${modTitle} — ${sectionTitle}` : modTitle;
    const subsections = sectionTitle ? [sectionTitle] : (sections && sections.length ? sections : [modTitle]);

    let md = '';
    md += `# ${scopeLabel}\n\n`;
    md += `*CFA Level I — ${volTitle}${sectionTitle ? ' · ' + modTitle : ''}*\n\n`;

    md += `## What this covers\n\n`;
    if (sectionTitle) {
      md += `This is one subtopic inside the **${modTitle}** module. Use this as a focused review of that specific piece — pair it with the full module if you need the surrounding context.\n\n`;
    } else if (subsections.length > 1) {
      md += `This module is organized into ${subsections.length} parts in the curriculum:\n\n`;
      subsections.forEach((s, i) => { md += `${i + 1}. **${s}**\n`; });
      md += `\n`;
    } else {
      md += `A single-part module in the ${volTitle} volume.\n\n`;
    }

    md += `## How to study it\n\n`;
    if (depth === 'standard') {
      md += `Work through each part above in order. For each one, make sure you can state:\n\n`;
      md += `- **The definition** — in your own words, not just the textbook phrasing.\n`;
      md += `- **The formula or framework**, if there is one, including what each input represents.\n`;
      md += `- **One worked example** you could reconstruct from memory.\n\n`;
      md += `That level is usually enough for a first pass through this material; come back to the "Advanced" or "Full mastery" depth setting closer to exam day.\n\n`;
    } else if (depth === 'mastery') {
      md += `Go through each part below using this sequence — it mirrors how a strong review course builds the topic:\n\n`;
      md += `1. **Core idea first.** Before touching a formula, be able to say in one sentence what problem this part of the curriculum is solving.\n`;
      md += `2. **Mechanism.** Understand *why* the relationship or formula holds, not just that it does — if you can't derive or explain the "why," you'll misapply it under vignette pressure.\n`;
      md += `3. **Worked example.** Build or find one full numeric example per part and walk it step by step, showing every intermediate number.\n`;
      md += `4. **Where it breaks.** Note the specific assumption each formula depends on, and what happens to the answer if that assumption is violated.\n`;
      md += `5. **Check yourself.** Close the book and try to reconstruct the formula and a fresh example from memory alone.\n\n`;
    } else {
      md += `For each part above, aim to nail three things: the **exact formula or framework**, **one clean worked example**, and the **one or two ways the exam typically twists it**. That combination — mechanics plus exam-craft — is what "advanced" depth means here.\n\n`;
    }

    md += `## What the exam tends to test here\n\n`;
    const angles = seededPick(EXAM_ANGLES, seedBase + 'angles', depth === 'standard' ? 2 : 4);
    angles.forEach(a => { md += `- ${a[0].toUpperCase() + a.slice(1)}\n`; });
    md += `\n*(These are general CFA Level I exam-craft patterns — always verify the specific numbers, definitions, and formulas for this topic against your official curriculum text or provider notes; this outline gives you the structure to organize that review, not a substitute for the source material.)*\n\n`;

    if (depth !== 'standard') {
      md += `## Common mistakes candidates make\n\n`;
      const miscons = seededPick(MISCONCEPTIONS, seedBase + 'miscons', depth === 'mastery' ? 3 : 2);
      miscons.forEach(m => { md += `- ${m[0].toUpperCase() + m.slice(1)}\n`; });
      md += `\n`;
    }

    if (depth === 'mastery') {
      md += `## Check your understanding\n\n`;
      md += `Without looking back at your notes: can you state the core definition or formula for **${subsections[0]}** from memory, and describe one situation where the "textbook" version of the rule would give a misleading answer?\n\n`;
    }

    const connection = CONNECTIONS_BY_VOLUME[volTitle];
    if (connection) {
      md += `## How this connects elsewhere in the curriculum\n\n`;
      md += `${connection[0].toUpperCase() + connection.slice(1)}\n\n`;
    }

    md += `---\n\n`;
    md += `*This study outline was generated locally from the embedded CFA Level I curriculum map — no external AI call was made, so it works fully offline once this page is loaded. For the authoritative content (definitions, formulas, worked numbers), use it alongside your official CFA Institute curriculum or prep-provider materials.*`;

    return md;
  }

  function renderTopicsModal(filterText){
    if (!els.topicsBody) return;
    const q = (filterText || '').trim().toLowerCase();
    els.topicsBody.innerHTML = '';
    let shownModCount = 0;

    OUTLINE_DATA.forEach((vol) => {
      // when searching, a module matches if its own title matches, the volume title matches,
      // or any of its subtopics match — and if only a subtopic matches, we still show the module
      // (auto-expanded) so the matching subtopic is visible and reachable.
      const modsToShow = q
        ? vol.modules.filter(m =>
            m.modTitle.toLowerCase().includes(q) ||
            vol.volTitle.toLowerCase().includes(q) ||
            (m.sections || []).some(s => s.toLowerCase().includes(q)))
        : vol.modules;
      if (q && !modsToShow.length) return;

      shownModCount += modsToShow.length;

      const volEl = document.createElement('div');
      volEl.className = 'topics-vol' + (q && modsToShow.length ? ' open' : '');
      volEl.dataset.vol = vol.volNum;

      const head = document.createElement('button');
      head.type = 'button';
      head.className = 'topics-vol-head';
      head.innerHTML = `<span class="vnum">Vol ${vol.volNum}</span><span class="vtitle">${vol.volTitle}</span><span class="vcount">${vol.modules.length} modules</span>
        <svg class="vchev" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      head.addEventListener('click', () => volEl.classList.toggle('open'));
      volEl.appendChild(head);

      const list = document.createElement('div');
      list.className = 'topics-mod-list';
      modsToShow.forEach(mod => {
        const sections = mod.sections || [];
        const modMatchesDirectly = !q || mod.modTitle.toLowerCase().includes(q) || vol.volTitle.toLowerCase().includes(q);
        const matchingSections = q ? sections.filter(s => s.toLowerCase().includes(q)) : sections;
        const autoOpen = q && (!modMatchesDirectly || matchingSections.length !== sections.length ? matchingSections.length > 0 : false);

        const wrap = document.createElement('div');
        wrap.className = 'topics-mod-wrap' + (autoOpen ? ' open' : '');

        const row = document.createElement('div');
        row.className = 'topics-mod-row';

        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'topics-mod-item';
        item.title = 'Get a detailed explanation of this whole module';
        item.innerHTML = `<span class="mnum">${mod.modNum}.</span><span class="mtitle">${mod.modTitle}</span>
          <svg class="marrow" width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        item.addEventListener('click', () => selectTopic(vol.volTitle, mod.modTitle));
        row.appendChild(item);

        if (sections.length) {
          const expandBtn = document.createElement('button');
          expandBtn.type = 'button';
          expandBtn.className = 'topics-mod-expand';
          expandBtn.title = 'Show subtopics';
          expandBtn.setAttribute('aria-label', 'Show subtopics for ' + mod.modTitle);
          expandBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          expandBtn.addEventListener('click', () => wrap.classList.toggle('open'));
          row.appendChild(expandBtn);
        }

        wrap.appendChild(row);

        if (sections.length) {
          const subList = document.createElement('div');
          subList.className = 'topics-sub-list';
          const subsToShow = q ? (matchingSections.length ? matchingSections : sections) : sections;
          subsToShow.forEach(sectionTitle => {
            const subItem = document.createElement('button');
            subItem.type = 'button';
            subItem.className = 'topics-sub-item';
            subItem.title = 'Get a detailed explanation of just this subtopic';
            subItem.innerHTML = `<span class="sdash">–</span><span class="stitle">${sectionTitle}</span>
              <svg class="sarrow" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            subItem.addEventListener('click', () => selectTopic(vol.volTitle, mod.modTitle, sectionTitle));
            subList.appendChild(subItem);
          });
          wrap.appendChild(subList);
        }

        list.appendChild(wrap);
      });
      volEl.appendChild(list);
      els.topicsBody.appendChild(volEl);
    });

    if (!shownModCount) {
      const empty = document.createElement('div');
      empty.className = 'topics-empty';
      empty.textContent = 'No modules or subtopics match "' + filterText + '".';
      els.topicsBody.appendChild(empty);
    }
    if (els.topicsFootCount) {
      els.topicsFootCount.textContent = q ? (shownModCount + ' of 94 modules') : '94 modules · 420+ subtopics';
    }
  }

  function buildTopicRequestPrompt(volTitle, modTitle, depth, sectionTitle, sections){
    const instructionByDepth = {
      standard: "Give me a clear, well-organized explanation of this topic — the core ideas, how they fit together, and what a CFA Level I candidate actually needs to know. Keep it focused and exam-relevant rather than exhaustive.",
      advanced: "Give me a detailed, exam-focused explanation of this topic as it's tested on the CFA Level I exam. Cover the core concepts, the key formulas or frameworks with a worked example where relevant, the most common mistakes or trick points candidates run into, and how this topic tends to connect to other parts of the curriculum.",
      mastery: "Teach me this topic the way a top CFA Level I instructor would in a full review session: build up the core intuition first, then the mechanism/derivation behind any formulas, then walk through at least one full worked example step by step, then flag the specific misconceptions or trap answers candidates fall for on this topic, then close with a short check-your-understanding question."
    };
    const instruction = instructionByDepth[depth] || instructionByDepth.advanced;
    const heading = sectionTitle
      ? `CFA Level I — ${volTitle} — ${modTitle} — ${sectionTitle}`
      : `CFA Level I — ${volTitle} — ${modTitle}`;
    const partsNote = (!sectionTitle && sections && sections.length)
      ? `This module covers: ${sections.join('; ')}.\n\n`
      : '';
    const scopeNote = sectionTitle
      ? `Focus specifically on the "${sectionTitle}" subtopic within the "${modTitle}" module — don't cover the whole module, just this part of it in depth.\n\n`
      : '';
    return `${heading}\n\n${partsNote}${scopeNote}${instruction}`;
  }

  async function selectTopic(volTitle, modTitle, sectionTitle){
    const depth = (els.topicsDepthSelect && els.topicsDepthSelect.value) || 'advanced';
    closeTopicsModal();

    const mod = OUTLINE_DATA.flatMap(v => v.modules).find(m => m.modTitle === modTitle) || {};
    const sections = mod.sections || [];

    const userLabel = sectionTitle
      ? `CFA Level I — ${volTitle} — ${modTitle} — ${sectionTitle} (${TOPIC_DEPTH_LABEL[depth] || depth})`
      : `CFA Level I — ${volTitle} — ${modTitle} (${TOPIC_DEPTH_LABEL[depth] || depth})`;

    const convo = ensureActiveConversation();
    if (convo.messages.length === 0) convo.title = (sectionTitle || modTitle).slice(0, 46);

    const parentId = convo.activeLeaf || (convo.messages.length ? convo.messages[convo.messages.length - 1].id : null);
    const userMsg = { id: uid(), parentId, role: 'user', content: userLabel };
    convo.messages.push(userMsg);
    convo.activeLeaf = userMsg.id;
    convo.updatedAt = Date.now();

    els.emptyState.style.display = 'none';
    renderBubble('user', userLabel, { msgId: userMsg.id });
    persistAll();
    renderConvoList();

    const pending = renderBubble('assistant', '', { typing: true, provider: applied.provider });

    // Topics are answered by the real, configured AI provider through your /api/chat function —
    // same backend and same provider/model/key setup as the main chat composer uses. If that
    // request isn't available yet (no backend deployed, or no API key configured server-side or
    // in Settings), we automatically fall back to a locally generated study outline built from
    // the embedded curriculum data, so Topics never just breaks or dumps a raw error either way.
    const provider = applied.provider;
    const model = applied.activeModel[provider] || DEFAULT_MODELS[provider];
    const apiKey = (applied.keys[provider] || '').trim();
    const prompt = buildTopicRequestPrompt(volTitle, modTitle, depth, sectionTitle, sections);
    const sys = buildSystemMessages(convo);
    const payloadMessages = [];
    if (sys.length) payloadMessages.push({ role: 'system', content: sys.join('\n\n') });
    payloadMessages.push({ role: 'user', content: prompt });

    const headers = { 'Content-Type': 'application/json', 'X-Provider': provider };
    if (apiKey) headers[HEADER_NAMES[provider]] = apiKey;

    let reply = null;
    let usedFallback = false;

    try {
      const res = await fetch('/api/chat', { method: 'POST', headers, body: JSON.stringify({ model, messages: payloadMessages, stream: false }) });
      const raw = await res.text();
      let data; try { data = JSON.parse(raw); } catch { data = null; }
      const looksLikeHtml = !data && typeof raw === 'string' && /^\s*<(!DOCTYPE|html)/i.test(raw);
      if (res.ok && data && !looksLikeHtml && data.choices && data.choices[0] && data.choices[0].message) {
        reply = data.choices[0].message.content || '';
      }
    } catch {
      // network/backend unreachable — fall through to the offline generator below
    }

    if (!reply || !reply.trim()) {
      usedFallback = true;
      reply = generateTopicExplanation(volTitle, modTitle, sections, depth, sectionTitle);
    }

    const meta = usedFallback
      ? 'AI backend unavailable — showing a locally generated study outline instead'
      : undefined;
    const asstMsg = { id: uid(), parentId: userMsg.id, role: 'assistant', content: reply, meta };
    convo.messages.push(asstMsg);
    convo.activeLeaf = asstMsg.id;
    convo.updatedAt = Date.now();
    persistAll();
    renderConvoList();

    if (meta) {
      const metaEl = document.createElement('div');
      metaEl.className = 'meta-line';
      metaEl.textContent = meta;
      pending.wrap.querySelector('.bubble-wrap').appendChild(metaEl);
    }

    streamReveal(pending.bubble, reply, () => {
      renderThreadFromActive();
      els.messageInput.focus();
    });
  }

  function openTopicsModal(){
    if (els.topicsSearchInput) els.topicsSearchInput.value = '';
    renderTopicsModal('');
    els.topicsOverlay.classList.add('show');
    if (els.topicsSearchInput) setTimeout(() => els.topicsSearchInput.focus(), 120);
  }
  function closeTopicsModal(){ els.topicsOverlay.classList.remove('show'); }

  if (els.topicsBtn) els.topicsBtn.addEventListener('click', openTopicsModal);
  if (els.topicsToggle) els.topicsToggle.addEventListener('click', openTopicsModal);
  if (els.browseTopicsChip) els.browseTopicsChip.addEventListener('click', openTopicsModal);
  if (els.topicsClose) els.topicsClose.addEventListener('click', closeTopicsModal);
  if (els.topicsOverlay) els.topicsOverlay.addEventListener('click', (e) => { if (e.target === els.topicsOverlay) closeTopicsModal(); });
  if (els.topicsSearchInput) els.topicsSearchInput.addEventListener('input', () => renderTopicsModal(els.topicsSearchInput.value));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && els.topicsOverlay && els.topicsOverlay.classList.contains('show')) closeTopicsModal(); });

  /* ---------------- sidebar mobile ---------------- */
  function openSidebar(){ els.sidebar.classList.add('open'); els.scrim.classList.add('show'); }
  function closeSidebar(){ els.sidebar.classList.remove('open'); els.scrim.classList.remove('show'); }
  if (els.menuBtn) els.menuBtn.addEventListener('click', openSidebar);
  els.scrim.addEventListener('click', closeSidebar);
  const shareBtn = $('shareBtn'), moreBtn = $('moreBtn');
  if (shareBtn) shareBtn.addEventListener('click', () => showToast('Share coming soon'));
  if (moreBtn) moreBtn.addEventListener('click', () => showToast('No additional options yet'));

  /* ---------------- settings modal ---------------- */
  function openModal(){
    draft = JSON.parse(JSON.stringify(applied));
    populateModal();
    els.modalOverlay.classList.add('show');
  }
  function closeModal(){ els.modalOverlay.classList.remove('show'); }
  els.settingsBtn.addEventListener('click', openModal);
  if (els.topSettingsBtn) els.topSettingsBtn.addEventListener('click', openModal);
  els.modalClose.addEventListener('click', closeModal);
  els.modalCancel.addEventListener('click', closeModal);
  els.modalOverlay.addEventListener('click', (e) => { if (e.target === els.modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && els.modalOverlay.classList.contains('show')) closeModal(); });

  els.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      els.tabs.forEach(t => t.classList.remove('active'));
      els.panes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      $('pane-' + tab.dataset.tab).classList.add('active');
    });
  });

  function detectKeyMismatch(key, provider){
    const k = key.trim();
    if (!k) return null;
    if (provider === 'nvidia' && /^sk-or-/i.test(k)) return 'This looks like an OpenRouter key, not a NVIDIA NIM key — check the Provider toggle above.';
    if (provider === 'openrouter' && /^nvapi-/i.test(k)) return 'This looks like a NVIDIA NIM key, not an OpenRouter key — check the Provider toggle above.';
    if (provider === 'nvidia' && k.length > 0 && !/^nvapi-/i.test(k)) return 'NVIDIA NIM keys usually start with "nvapi-" — double check you copied the right value.';
    if (provider === 'openrouter' && k.length > 0 && !/^sk-or-/i.test(k)) return 'OpenRouter keys usually start with "sk-or-" — double check you copied the right value.';
    return null;
  }

  function extractKeyAndModelFromPaste(pasted){
    let key = null, model = null;
    const keyMatch = pasted.match(/nvapi-[A-Za-z0-9_-]{20,}/) || pasted.match(/sk-or-[A-Za-z0-9_-]{20,}/);
    if (keyMatch) key = keyMatch[0];
    const modelMatch = pasted.match(/model\s*[:=]\s*["']([^"']+)["']/i);
    if (modelMatch) model = modelMatch[1];
    return { key, model };
  }

  function updateKeyValidation(){
    const val = els.apiKeyInput.value;
    const msg = detectKeyMismatch(val, draft.provider);
    if (msg) {
      els.keyValidationMsg.innerHTML = '<div class="inline-msg warn" style="margin-top:8px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 003.54 21H20.46A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z" stroke="currentColor" stroke-width="1.7"/></svg><span>' + msg + '</span></div>';
    } else {
      els.keyValidationMsg.innerHTML = '';
    }
  }

  els.apiKeyInput.addEventListener('input', () => { draft.keys[draft.provider] = els.apiKeyInput.value; updateKeyValidation(); });
  els.apiKeyInput.addEventListener('paste', (e) => {
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    if (pasted.length > 60 && /model|api_key|Authorization/i.test(pasted)) {
      const { key, model } = extractKeyAndModelFromPaste(pasted);
      if (key) {
        e.preventDefault();
        els.apiKeyInput.value = key;
        draft.keys[draft.provider] = key;
        if (model) { els.modelInput.value = model; draft.activeModel[draft.provider] = model; }
        updateKeyValidation();
        showToast('Key' + (model ? ' and model' : '') + ' extracted from pasted snippet');
      }
    }
  });
  els.toggleKeyVis.addEventListener('click', () => {
    const isPw = els.apiKeyInput.type === 'password';
    els.apiKeyInput.type = isPw ? 'text' : 'password';
    els.toggleKeyVis.textContent = isPw ? 'hide' : 'show';
  });

  els.providerToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.provider-card');
    if (!btn) return;
    draft.provider = btn.dataset.p;
    populateModal(true);
  });

  els.modelInput.addEventListener('input', () => { draft.activeModel[draft.provider] = els.modelInput.value; });
  els.pinModelBtn.addEventListener('click', () => {
    const v = els.modelInput.value.trim();
    if (!v) return;
    if (!draft.models[draft.provider].includes(v)) draft.models[draft.provider].unshift(v);
    renderModelChips();
    showToast('Model saved');
  });

  function renderModelChips(){
    els.modelChips.innerHTML = '';
    const list = draft.models[draft.provider] || [];
    list.forEach(m => {
      const chip = document.createElement('div');
      chip.className = 'model-chip' + (m === (draft.activeModel[draft.provider] || DEFAULT_MODELS[draft.provider]) ? ' active' : '');
      const label = document.createElement('span');
      label.textContent = m.length > 34 ? m.slice(0, 32) + '…' : m;
      label.title = m;
      chip.appendChild(label);
      const x = document.createElement('button');
      x.className = 'mx'; x.type = 'button'; x.innerHTML = '×';
      x.addEventListener('click', (e) => { e.stopPropagation(); draft.models[draft.provider] = draft.models[draft.provider].filter(x2 => x2 !== m); renderModelChips(); });
      chip.appendChild(x);
      chip.addEventListener('click', () => { draft.activeModel[draft.provider] = m; els.modelInput.value = m; renderModelChips(); });
      els.modelChips.appendChild(chip);
    });
  }

  function renderPromptChips(){
    els.promptChips.innerHTML = '';
    draft.prompts.forEach(p => {
      const chip = document.createElement('div');
      chip.className = 'model-chip';
      const label = document.createElement('span');
      label.textContent = p.length > 40 ? p.slice(0, 38) + '…' : p;
      label.title = p;
      chip.appendChild(label);
      const x = document.createElement('button');
      x.className = 'mx'; x.type = 'button'; x.innerHTML = '×';
      x.addEventListener('click', (e) => { e.stopPropagation(); draft.prompts = draft.prompts.filter(p2 => p2 !== p); renderPromptChips(); });
      chip.appendChild(x);
      chip.addEventListener('click', () => { els.messageInput.value = p + ' '; closeModal(); els.messageInput.focus(); els.messageInput.dispatchEvent(new Event('input')); });
      els.promptChips.appendChild(chip);
    });
  }
  els.addPromptBtn.addEventListener('click', () => {
    const v = els.newPromptInput.value.trim();
    if (!v) return;
    draft.prompts.push(v);
    els.newPromptInput.value = '';
    renderPromptChips();
  });

  els.themeInk.addEventListener('click', () => { draft.theme = 'ink'; syncThemeSwatches(); });
  els.themeGraphite.addEventListener('click', () => { draft.theme = 'graphite'; syncThemeSwatches(); });
  function syncThemeSwatches(){
    els.themeInk.classList.toggle('active', draft.theme === 'ink');
    els.themeGraphite.classList.toggle('active', draft.theme === 'graphite');
  }
  els.compactToggle.addEventListener('change', () => { draft.compact = els.compactToggle.checked; });
  els.pulseToggle.addEventListener('change', () => { draft.pulse = els.pulseToggle.checked; });

  els.clearConvosBtn.addEventListener('click', () => {
    if (!confirm('Delete all conversations? This cannot be undone.')) return;
    conversations = []; activeId = null;
    persistAll(); renderConvoList(); renderThreadFromActive(); updateDataStats();
    showToast('All conversations cleared');
  });
  els.resetAllBtn.addEventListener('click', () => {
    if (!confirm('Reset Nexus completely? This deletes conversations, keys, and preferences.')) return;
    localStorage.clear();
    location.reload();
  });

  function updateDataStats(){
    els.statConvos.textContent = conversations.length;
    els.statMsgs.textContent = conversations.reduce((n, c) => n + c.messages.length, 0);
  }

  function populateModal(keepTab){
    [...els.providerToggle.querySelectorAll('.provider-card')].forEach(b => b.classList.toggle('active', b.dataset.p === draft.provider));
    els.keyLabel.textContent = (draft.provider === 'nvidia' ? 'NVIDIA NIM' : 'OpenRouter') + ' API key';
    els.apiKeyInput.placeholder = draft.provider === 'nvidia' ? 'nvapi-••••••••••••••••' : 'sk-or-••••••••••••••••';
    els.apiKeyInput.value = draft.keys[draft.provider] || '';
    els.apiKeyInput.type = 'password'; els.toggleKeyVis.textContent = 'show';
    updateKeyValidation();
    els.modelInput.value = draft.activeModel[draft.provider] || DEFAULT_MODELS[draft.provider];
    els.modelDesc.innerHTML = draft.provider === 'nvidia'
      ? 'Smaller/lighter models are more likely to drop spaces or characters on long structured output like tables and figures. For reliable structured output, prefer a larger instruct model — browse the current catalog and exact model IDs at <a href="https://build.nvidia.com" target="_blank" rel="noopener">build.nvidia.com</a>.'
      : 'Any OpenRouter model slug works, e.g. <code class="mono" style="background:none;padding:0;">anthropic/claude-3.5-sonnet</code>. Browse the full catalog at <a href="https://openrouter.ai/models" target="_blank" rel="noopener">openrouter.ai/models</a>.';
    renderModelChips();
    els.systemPrompt.value = draft.system;
    renderPromptChips();
    syncThemeSwatches();
    els.compactToggle.checked = draft.compact;
    els.pulseToggle.checked = draft.pulse;
    updateDataStats();
    els.modalSave.dataset.provider = draft.provider;
  }
  els.systemPrompt.addEventListener('input', () => { draft.system = els.systemPrompt.value; });

  els.modalSave.addEventListener('click', () => {
    applied = JSON.parse(JSON.stringify(draft));
    persistAll();
    syncTopbar();
    syncModesToggle();
    syncDualToggle();
    document.body.setAttribute('data-theme', applied.theme);
    document.body.classList.toggle('compact', applied.compact);
    const c = getActive();
    if (c && c.messages.length === 0) { c.provider = applied.provider; c.model = applied.activeModel[applied.provider] || DEFAULT_MODELS[applied.provider]; persistAll(); renderConvoList(); }
    closeModal();
    showToast('Settings saved');
  });

  /* ---------------- init ---------------- */
  document.body.setAttribute('data-theme', applied.theme);
  document.body.classList.toggle('compact', applied.compact);
  renderConvoList();
  renderThreadFromActive();
  syncTopbar();
  syncModesToggle();
  syncDualToggle();
})();
</script>
</body>
</html>
