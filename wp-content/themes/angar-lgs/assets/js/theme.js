(function(){
  const nav=document.getElementById('nav');
  const menu=document.getElementById('primary-menu');
  const toggle=document.querySelector('.menu-toggle');
  const scrollTopButton=document.querySelector('.scroll-top');
  if(toggle&&menu){toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',open?'true':'false')});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));}
  const onScroll=()=>{document.documentElement.style.setProperty('--scroll-y', String(window.scrollY)); if(nav) nav.classList.toggle('scrolled', window.scrollY>60); if(scrollTopButton) scrollTopButton.classList.toggle('visible',window.scrollY>560)}; window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  if(scrollTopButton)scrollTopButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  if('IntersectionObserver' in window){const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}
  document.querySelectorAll('.faq-item button').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.faq-item');const open=item.classList.contains('open');document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));if(!open)item.classList.add('open');}));
  document.querySelectorAll('input[type="tel"]').forEach(input=>input.addEventListener('input',()=>{input.value=input.value.replace(/[^0-9+()\-\s]/g,'').slice(0,24)}));

  const lightbox=document.createElement('div');
  lightbox.className='project-lightbox';
  lightbox.setAttribute('aria-hidden','true');
  lightbox.innerHTML='<div class="project-lightbox__backdrop" data-lightbox-close></div><div class="project-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Project photo"><button class="project-lightbox__close" type="button" aria-label="Close" data-lightbox-close>&times;</button><button class="project-lightbox__nav project-lightbox__nav--prev" type="button" aria-label="Previous photo">&#8249;</button><img src="" alt=""><button class="project-lightbox__nav project-lightbox__nav--next" type="button" aria-label="Next photo">&#8250;</button></div>';
  document.body.appendChild(lightbox);
  const lightboxImg=lightbox.querySelector('img');
  const lightboxPrev=lightbox.querySelector('.project-lightbox__nav--prev');
  const lightboxNext=lightbox.querySelector('.project-lightbox__nav--next');
  let lightboxPhotos=[];
  let lightboxIndex=0;
  const showLightboxPhoto=i=>{
    if(!lightboxPhotos.length) return;
    lightboxIndex=(i+lightboxPhotos.length)%lightboxPhotos.length;
    const photo=lightboxPhotos[lightboxIndex];
    lightboxImg.src=photo.src;
    lightboxImg.alt=photo.alt;
  };
  const closeLightbox=()=>{
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('lightbox-open');
  };
  const openLightbox=(photos,index)=>{
    lightboxPhotos=photos;
    showLightboxPhoto(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('lightbox-open');
    lightbox.querySelector('.project-lightbox__close').focus();
  };
  lightbox.querySelectorAll('[data-lightbox-close]').forEach(btn=>btn.addEventListener('click',closeLightbox));
  lightboxPrev.addEventListener('click',()=>showLightboxPhoto(lightboxIndex-1));
  lightboxNext.addEventListener('click',()=>showLightboxPhoto(lightboxIndex+1));
  document.addEventListener('keydown',event=>{
    if(!lightbox.classList.contains('open')) return;
    if(event.key==='Escape') closeLightbox();
    if(event.key==='ArrowLeft') showLightboxPhoto(lightboxIndex-1);
    if(event.key==='ArrowRight') showLightboxPhoto(lightboxIndex+1);
  });

  document.querySelectorAll('.project-case').forEach(card=>{
    const mainLink = card.querySelector('.project-main-photo');
    const mainImg = mainLink ? mainLink.querySelector('img') : null;
    const thumbs = [...card.querySelectorAll('.project-thumb')];
    const prev = card.querySelector('.project-slide-btn.prev');
    const next = card.querySelector('.project-slide-btn.next');
    if(!mainLink || !mainImg || !thumbs.length) return;
    let index = Math.max(0, thumbs.findIndex(t=>t.classList.contains('active')));
    const show = i => {
      index = (i + thumbs.length) % thumbs.length;
      const thumb = thumbs[index];
      mainImg.src = thumb.dataset.src;
      mainImg.alt = thumb.dataset.alt || mainImg.alt;
      mainLink.href = thumb.dataset.href || thumb.dataset.src;
      thumbs.forEach(t=>t.classList.toggle('active', t === thumb));
    };
    mainLink.addEventListener('click',event=>{
      event.preventDefault();
      const photos=thumbs.map(thumb=>({src:thumb.dataset.src,alt:thumb.dataset.alt || mainImg.alt}));
      openLightbox(photos,index);
    });
    thumbs.forEach((thumb,i)=>thumb.addEventListener('click',()=>show(i)));
    if(prev) prev.addEventListener('click',()=>show(index-1));
    if(next) next.addEventListener('click',()=>show(index+1));
  });

  document.querySelectorAll('[data-quiz]').forEach(quiz=>{
    const steps=[...quiz.querySelectorAll('.quiz-step')];
    const progress=quiz.querySelector('.quiz-progress span');
    const answers=[];
    let step=0;
    const show=i=>{step=Math.max(0,Math.min(i,steps.length-1));steps.forEach((s,idx)=>s.classList.toggle('active',idx===step));if(progress)progress.style.width=((step+1)/steps.length*100)+'%';};
    quiz.querySelectorAll('.quiz-options:not(.multi) button').forEach(btn=>btn.addEventListener('click',()=>{answers[step]=btn.dataset.value;show(step+1);}));
    quiz.querySelectorAll('.quiz-options.multi button').forEach(btn=>btn.addEventListener('click',()=>btn.classList.toggle('active')));
    const next=quiz.querySelector('.quiz-next');
    if(next)next.addEventListener('click',()=>{answers[step]=[...quiz.querySelectorAll('.quiz-options.multi button.active')].map(b=>b.dataset.value).join(', ')||'Без дополнительных опций';show(step+1);const result=quiz.querySelector('[data-quiz-result]');const msg=quiz.querySelector('[data-quiz-message]');const text='Квиз расчета: тип - '+(answers[0]||'')+'; площадь - '+(answers[1]||'')+'; регион - '+(answers[2]||'')+'; опции - '+(answers[3]||'');if(result)result.value=answers[0]||'Квиз расчета';if(msg)msg.value=text;});
    show(0);
  });
})();
