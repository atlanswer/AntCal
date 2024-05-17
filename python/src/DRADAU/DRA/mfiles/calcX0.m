%--------------------------------------------------------------------------
%                                calcX0.m                                   
%--------------------------------------------------------------------------
%  Note: This file is a part of the "Dielectric resonator design and 
%        analysis utility" (DRA.m). It is used by aRing_fr, dRing_fr, 
%        aRing_en, and dRing_en to calculate the X0 parameter of a ring
%        resonator for any 'inner radius/outer radius' (b/a) ratio between 
%        0 and 0.95.
%
%  Note : Ce fichier fait partie de l'Outil de conception et d'analyse 
%         des résonateurs diélectriques (DRA.m). Il est utilisé par
%         aRing_fr, dRing_fr, aRing_en et dRing_en pour calculer le
%         facteur X0 d'un résonateur annulaire pour n'importe quel ratio
%         'rayon interne/rayon externe' (b/a) entre 0 et 0.95.
%
%  Programming/Programmation : Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation : Institut national de la recherche scientifique (INRS)  
%  Last modification/Dernière modification : 2008-07-31                              
%--------------------------------------------------------------------------

function X0 = calcX0(ratio_trou)

X0 = 0;

if ((ratio_trou >= 0) && (ratio_trou <= 0.4))
    bas = 3.83;
    haut = 5.425;
elseif ((ratio_trou >= 0.41) && (ratio_trou <= 0.63))
    bas = 5.435;
    haut = 8.59;
elseif ((ratio_trou >= 0.64) && (ratio_trou <= 0.73))
    bas = 8.60;
    haut = 11.74;
elseif ((ratio_trou >= 0.74) && (ratio_trou <= 0.78))
    bas = 11.75;
    haut = 14.89;
elseif ((ratio_trou >= 0.79) && (ratio_trou <= 0.82))
    bas = 14.91;
    haut = 18.03;
elseif ((ratio_trou >= 0.83) && (ratio_trou <= 0.85))
    bas = 18.05;
    haut = 21.18;
elseif ((ratio_trou >= 0.86) && (ratio_trou <= 0.87))
    bas = 21.19;
    haut = 24.32;
elseif (ratio_trou == 0.88)
    X0 = 26.1962;
    return
elseif (ratio_trou == 0.89)
    X0 = 28.5747;
    return
elseif (ratio_trou == 0.90)
    X0 = 31.4292;
    return
elseif (ratio_trou == 0.91)
    X0 = 34.9184;
    return    
elseif (ratio_trou == 0.92)
    X0 = 39.2803;
    return    
elseif (ratio_trou == 0.93)
    X0 = 44.8889;
    return
elseif (ratio_trou == 0.94)
    X0 = 52.3675;
    return    
elseif (ratio_trou == 0.95)
    X0 = 62.8381;
    return    
else
    return
end

if (X0 == 0)
    appx = [bas haut];
    syms x;
    f = char(vectorize(besselj(1,x)/bessely(1,x)-besselj(1,ratio_trou*x)/bessely(1,ratio_trou*x)));
    X0 = fzero(inline(f),appx);
end

end