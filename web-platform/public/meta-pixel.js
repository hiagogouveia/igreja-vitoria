/* Meta Pixel · Igreja Vitória — código base OFICIAL (ID 2266189376864307).
   Fonte única da verdade: carregado tanto pelo app Next (via next/script no
   layout raiz) quanto pelas páginas estáticas de /public (via <script defer>),
   para que o snippet não seja duplicado em lugar nenhum.
   O próprio snippet é idempotente (`if(f.fbq)return;`), então nunca inicializa
   duas vezes. Para eventos futuros, use os helpers de src/lib/meta-pixel.ts. */
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2266189376864307');
fbq('track', 'PageView');
