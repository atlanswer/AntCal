%--------------------------------------------------------------------------
%                               coeffTE.m                                   
%--------------------------------------------------------------------------
%  Note: This file is a part of the "Dielectric resonator design and 
%        analysis utility" (DRA.m). It is used by aRing_fr, dRing_fr, 
%        aRing_en, and dRing_en to generate a 9th order polynomial to
%        estimate the value of 'ka' of the TE01d mode of a ring resonator. 
%        The coefficients in matrix 'c' are taken from the book "Dielectric 
%        resonator antenna handbook" by Aldo Petosa. Unfortunately, this 
%        book only gives the coefficients for b/a ratios of 0, 0.25, 0.5, 
%        and 0.75. To address this issue, coeffTE uses a third degree 
%        curve fitting technique to extrapolate the coefficients for any 
%        value of b/a and generates the corresponding 9th degree 
%        polynomial.
%
%  Note : Ce fichier fait partie de l'Outil de conception et d'analyse 
%         des résonateurs diélectriques (DRA.m). Il est utilisé par
%         aRing_fr, dRing_fr, aRing_en et dRing_en pour générer un polynôme
%         de degré 9 permettant d'estimer la valeur de 'ka' du mode TE01d 
%         d'un résonateur annulaire. Les coefficients dans la matrice 'c' 
%         proviennent du livre "Dielectric resonator antenna handbook" de
%         Also Petosa. Malheureusement, ce livre ne donne que les
%         coefficients pour des ratios de 0, 0.25, 0.5 et 0.75. CoeffTE
%         utilise donc une estimation de troisième ordre pour extrapoler
%         les coefficients pour n'importe quelle valeur de b/a et génère le
%         polynôme de 9e degré correspondant.
%
%  Programming/Programmation : Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation : Institut national de la recherche scientifique (INRS)  
%  Last modification/Dernière modification : 2008-07-22                              
%--------------------------------------------------------------------------

function p = coeffTE(ratio_trou)

c = [6.623       6.6371     7.1552     8.7718;
    -15.811     -15.724    -17.313    -20.491;
     30.294      30.062     33.523     38.941;
    -33.364     -33.107    -37.378    -42.814;
     22.479      22.339     25.501     28.89;
    -9.5552     -9.518     -10.968    -12.318;
     2.5696      2.5665     2.9809     3.3245;
    -0.4236     -0.42424   -0.49594   -0.55002;
     0.039041    0.0392     0.046066   0.050863;
    -0.0015398  -0.0015497 -0.0018289 -0.0020121];

x = 0:0.25:0.75;
p = zeros(1,10); 

for n = 1:1:10
    p(1,n) = polyval(polyfit(x,c(n,:),3),ratio_trou);
end

p = fliplr(p);

end