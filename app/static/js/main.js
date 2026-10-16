(function(){
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- hero typing ---- */
  var typed = document.getElementById('typed');
  var out = document.getElementById('hero-out');
  var word = 'whoami';
  function reveal(){ out.classList.remove('pending'); if (!reduce) out.classList.add('show'); }
  if (!typed || !out) {}
  else if (reduce) { typed.textContent = word; reveal(); }
  else {
    out.classList.add('pending');
    typed.textContent = '';
    var i = 0;
    setTimeout(function step(){
      if (i < word.length) { typed.textContent += word.charAt(i++); setTimeout(step, 70 + Math.random()*70); }
      else setTimeout(reveal, 260);
    }, 450);
  }

  /* ---- tmux clock (Malaysia time) ---- */
  var clock = document.getElementById('clock');
  function tick(){
    try {
      clock.textContent = new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Kuala_Lumpur'}) + ' MYT';
    } catch(e){ clock.textContent = ''; }
  }
  tick(); setInterval(tick, 30000);
  document.getElementById('yr').textContent = new Date().getFullYear();

  /* ---- active window in status bar ---- */
  var links = document.querySelectorAll('.tmux ol a');
  var secs = ['top','about','career','projects','skills','contact'].map(function(id){ return document.getElementById(id); }).filter(Boolean);
  if (!secs.length) links = [];
  function setActive(id){
    for (var k=0;k<links.length;k++){
      if (links[k].getAttribute('data-sec') === id) links[k].setAttribute('aria-current','true');
      else links[k].removeAttribute('aria-current');
    }
  }
  function onScroll(){
    var y = window.scrollY + window.innerHeight * 0.35, cur = 'top';
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) cur = 'contact';
    else secs.forEach(function(s){ if (s && s.offsetTop <= y) cur = s.id; });
    setActive(cur);
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---- career timeline plot (rendered as text, refit to the box width) ---- */
  var plot = document.getElementById('plot');
  if (plot) {
  // roles come from the server-rendered JSON block (newest first)
  var roles = JSON.parse(document.getElementById('roles-data').textContent).map(function(r){
    var ym = function(v){ return v ? v.split('-').map(Number) : null; };
    return {id:r.slug, lbl:r.slug, s:ym(r.start), e:ym(r.end), intern:r.internship};
  });
  var now = new Date();
  var Y0 = roles.reduce(function(m, r){ return Math.min(m, r.s[0]); }, now.getFullYear()), Y1 = now.getFullYear() + 1;
  var mo = function(ym){ return (ym[0]-Y0)*12 + (ym[1]-1); };
  var nowM = mo([now.getFullYear(), now.getMonth()+1]) + 0.5, span = (Y1-Y0)*12;
  function esc(t){ return t.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function pad(t,n){ while (t.length < n) t += ' '; return t; }
  function dur(m){ var y = Math.floor(m/12), r = m%12; return (y ? y+'y ' : '') + r + 'm'; }
  function charW(){
    var t = document.createElement('span'); t.textContent = '0000000000';
    t.style.visibility = 'hidden'; plot.appendChild(t);
    var w = t.getBoundingClientRect().width / 10; plot.removeChild(t); return w || 7.5;
  }
  function render(){
    var cols = Math.floor(plot.clientWidth / charW());
    var L = 11, showDur = cols >= 54, W = cols - L - 1 - (showDur ? 8 : 0);
    W = Math.max(W, 18);
    var colOf = function(m){ return Math.min(W-1, Math.floor(m / span * W)); };
    var yearCols = {}; for (var y=Y0; y<Y1; y++) yearCols[colOf((y-Y0)*12)] = y;
    var todayC = colOf(nowM), html = '', total = 0;
    roles.forEach(function(r){
      var a = mo(r.s), b = r.e ? mo(r.e) : nowM, months = Math.floor(b - a);
      total += months;
      var c0 = colOf(a), c1 = Math.max(c0, colOf(b - 0.01)), ch = r.intern ? '▒' : '█';
      var cls = 'bar' + (r.intern ? ' intern' : '') + (r.e ? '' : ' now');
      var line = '<span class="lbl">' + pad(r.lbl, L-1) + '</span> <span class="ax">│</span>';
      for (var c=0; c<W; c++){
        if (c >= c0 && c <= c1){
          var run = c1 - c + 1;
          if (r.e) line += '<span class="' + cls + '">' + Array(run+1).join(ch) + '</span>';
          else line += '<span class="' + cls + '">' + Array(run).join(ch) + '</span><span class="tip">▶</span>';
          c = c1; continue;
        }
        line += c === todayC ? '<span class="today">┆</span>' : (c in yearCols ? '<span class="grid">·</span>' : ' ');
      }
      if (showDur) line += '  <span class="dur">' + pad(dur(months), 6) + '</span>';
      html += '<a class="row" href="#role-' + r.id + '" data-role="' + r.id + '">' + line + '</a>';
    });
    // axis + year labels
    var axis = pad('', L) + '<span class="ax">└', labels = pad('', L+1+W).split('');
    var short = W / (Y1-Y0) < 6;
    for (var c=0; c<W; c++) axis += c === todayC ? '<span class="today">┴</span>' : (c in yearCols ? '┴' : '─');
    axis += '</span>';
    Object.keys(yearCols).forEach(function(k){
      var t = short ? "'" + String(yearCols[k]).slice(2) : String(yearCols[k]), at = L + 1 + (+k);
      for (var i=0; i<t.length && at+i < L+1+W; i++) labels[at+i] = t[i];
    });
    plot.innerHTML = html + axis + '\n<span class="yr">' + esc(labels.join('')) + '</span>';
    document.getElementById('plot-sum').textContent = 'Σ ' + dur(total) + ' across ' + roles.length + ' roles';
  }
  render();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
  var rt; window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(render, 120); });

  // hovering a bar highlights its commit, and vice versa
  function hl(id, on){
    document.querySelectorAll('[data-role="' + id + '"]').forEach(function(el){ el.classList.toggle('hl', on); });
  }
  ['mouseover','mouseout','focusin','focusout'].forEach(function(ev){
    document.getElementById('career').addEventListener(ev, function(e){
      var el = e.target.closest && e.target.closest('[data-role]');
      if (el) hl(el.getAttribute('data-role'), ev === 'mouseover' || ev === 'focusin');
    });
  });

  }

  /* ---- interactive prompt ---- */
  if (!document.getElementById('shell')) return;
  var shell = document.getElementById('shell').dataset;
  var form = document.getElementById('shell-form');
  var input = document.getElementById('shell-in');
  var log = document.getElementById('shell-out');
  var history = [], hIdx = 0;

  function line(text, cls){
    var p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  }
  function go(id, label){
    var el = document.getElementById(id);
    if (!el) return;
    line('→ jumping to ' + label + ' …', 'ok');
    setTimeout(function(){
      el.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'});
      el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
      var h = el.querySelector('h1, h2');
      if (h){ h.setAttribute('tabindex','-1'); h.focus({preventScroll:true}); }
    }, 180);
  }
  var cmds = {
    help: function(){
      line('available commands:');
      line('  about      cat about.md');
      line('  career     career --plot + git log   (alias: experience, work)');
      line('  projects   ls projects/');
      line('  skills     skills --list');
      line('  contact    how to reach me');
      line('  email      open your mail client');
      line('  github     open ' + shell.githubLabel);
      line('  clear      clear this screen');
    },
    about: function(){ go('about','about.md'); },
    career: function(){ go('career','git log --career'); },
    projects: function(){ go('projects','projects/'); },
    skills: function(){ go('skills','skills --list'); },
    contact: function(){ go('contact','contact'); },
    whoami: function(){ line(shell.whoami); },
    email: function(){ line('opening mailto:' + shell.email, 'ok'); window.location.href = 'mailto:' + shell.email; },
    github: function(){ line('opening ' + shell.githubLabel, 'ok'); window.open(shell.github, '_blank', 'noopener'); },
    linkedin: function(){ line('opening ' + shell.linkedinLabel, 'ok'); window.open(shell.linkedin, '_blank', 'noopener'); },
    ls: function(){ line('about.md  career.log  projects/  skills.txt  contact'); },
    home: function(){ go('top','~'); },
    clear: function(){ log.innerHTML = ''; },
    sudo: function(){ line('nice try. this incident will be reported.', 'err'); }
  };
  var alias = { experience:'career', work:'career', exp:'career', 'git':'career', top:'home', '~':'home', cd:'home', mail:'email', cls:'clear', '?':'help', man:'help' };

  function run(raw){
    var v = String(raw || '').trim();
    var echo = document.createElement('p');
    echo.className = 'echo';
    var ps = document.createElement('span'); ps.className = 'ps'; ps.textContent = '$ ';
    echo.appendChild(ps); echo.appendChild(document.createTextNode(v));
    log.appendChild(echo);
    if (!v){ log.scrollTop = log.scrollHeight; return; }
    history.push(v); hIdx = history.length;
    var parts = v.toLowerCase().split(/\s+/);
    var c = parts[0];
    if (c === 'cd' && parts[1]) c = parts[1].replace(/[\/.]/g,'') || 'home';
    if (c === 'cat' && parts[1]) c = parts[1].replace(/\.\w+$/,'');
    c = alias[c] || c;
    if (Object.prototype.hasOwnProperty.call(cmds, c)) cmds[c]();
    else line('zsh: command not found: ' + parts[0] + ' — try "help"', 'err');
  }

  form.addEventListener('submit', function(e){ e.preventDefault(); run(input.value); input.value=''; });
  input.addEventListener('keydown', function(e){
    if (e.key === 'ArrowUp' && history.length){ e.preventDefault(); hIdx = Math.max(0, hIdx-1); input.value = history[hIdx]; }
    else if (e.key === 'ArrowDown' && history.length){ e.preventDefault(); hIdx = Math.min(history.length, hIdx+1); input.value = history[hIdx] || ''; }
    else if (e.key === 'Tab' && input.value){
      var m = Object.keys(cmds).filter(function(k){ return k.indexOf(input.value.toLowerCase()) === 0; });
      if (m.length === 1){ e.preventDefault(); input.value = m[0]; }
    }
  });
  document.querySelectorAll('.chips button').forEach(function(b){
    b.addEventListener('click', function(){ run(b.getAttribute('data-cmd')); });
  });
  /* "/" focuses the prompt, like a real shell hotkey */
  document.addEventListener('keydown', function(e){
    if (e.key === '/' && document.activeElement !== input && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)){
      e.preventDefault(); input.focus({preventScroll:false});
    }
  });
})();
