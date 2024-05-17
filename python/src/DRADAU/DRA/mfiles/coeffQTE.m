%--------------------------------------------------------------------------
%                               coeffQTE.m                                   
%--------------------------------------------------------------------------
%  Note: This file is a part of the "Dielectric resonator design and 
%        analysis utility" (DRA.m). It is used by aRing_fr, dRing_fr, 
%        aRing_en, and dRing_en to generate a 9th order polynomial to
%        estimate the Q-factor of the TE01d mode of a ring resonator. The 
%        coefficients in matrix 'c' are taken from the book "Dielectric 
%        resonator antenna handbook" by Aldo Petosa. Unfortunately, this 
%        book only gives the coefficients for b/a ratios of 0, 0.25, 0.5, 
%        and 0.75. To address this issue, coeffQTE uses a third degree 
%        curve fitting technique to extrapolate the coefficients for any 
%        value of b/a and generates the corresponding 9th degree 
%        polynomial.
%
%  Note : Ce fichier fait partie de l'Outil de conception et d'analyse 
%         des résonateurs diélectriques (DRA.m). Il est utilisé par
%         aRing_fr, dRing_fr, aRing_en et dRing_en pour générer un polynôme
%         de degré 9 permettant d'estimer le facteur Q du mode TE01d d'un
%         résonateur annulaire. Les coefficients dans la matrice 'c' 
%         proviennent du livre "Dielectric resonator antenna handbook" de
%         Also Petosa. Malheureusement, ce livre ne donne que les
%         coefficients pour des ratios de 0, 0.25, 0.5 et 0.75. CoeffQTE
%         utilise donc une estimation de troisième ordre pour extrapoler
%         les coefficients pour n'importe quelle valeur de b/a et génère le
%         polynôme de 9e degré correspondant.
%
%  Programming/Programmation : Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation : Institut national de la recherche scientifique (INRS)  
%  Last modification/Dernière modification : 2008-07-31                             
%--------------------------------------------------------------------------

function p = coeffQTE(ratio)

c = [-0.051546  -0.044498   -0.039177  -0.015552;
      0.8917     0.8167      0.65547    0.28033;
     -1.6087    -1.4312     -1.2112    -0.51894;
      1.5724     1.3563      1.2486     0.53503;
     -0.94874   -0.79639    -0.8069    -0.34471;
      0.36677    0.30131     0.33551    0.14263;
     -0.091005  -0.073555   -0.089281  -0.037765;
      0.014018   0.011194    0.014655   0.006173;
     -0.0012202 -0.00096582 -0.001349  -0.00056654;
      4.5859e-5  3.6066e-5   5.3214e-5  2.2309e-5];
     
x = 0:0.25:0.75;
p = zeros(1,10); 

for n = 1:1:10
    p(1,n) = polyval(polyfit(x,c(n,:),3),ratio);
end

p = fliplr(p);

end