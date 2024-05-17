%--------------------------------------------------------------------------
%                               coeffQTM.m                                   
%--------------------------------------------------------------------------
%  Note: This file is a part of the "Dielectric resonator design and 
%        analysis utility" (DRA.m). It is used by aRing_fr, dRing_fr, 
%        aRing_en, and dRing_en to generate a 9th order polynomial to
%        estimate the Q-factor of the TM01d mode of a ring resonator. The 
%        coefficients in matrix 'c' are taken from the book "Dielectric 
%        resonator antenna handbook" by Aldo Petosa. Unfortunately, this 
%        book only gives the coefficients for b/a ratios of 0, 0.25, 0.5, 
%        and 0.75. To address this issue, coeffQTM uses a third degree 
%        curve fitting technique to extrapolate the coefficients for any 
%        value of b/a and generates the corresponding 9th degree 
%        polynomial.
%
%  Note : Ce fichier fait partie de l'Outil de conception et d'analyse 
%         des résonateurs diélectriques (DRA.m). Il est utilisé par
%         aRing_fr, dRing_fr, aRing_en et dRing_en pour générer un polynôme
%         de degré 9 permettant d'estimer le facteur Q du mode TM01d d'un
%         résonateur annulaire. Les coefficients dans la matrice 'c' 
%         proviennent du livre "Dielectric resonator antenna handbook" de
%         Also Petosa. Malheureusement, ce livre ne donne que les
%         coefficients pour des ratios de 0, 0.25, 0.5 et 0.75. CoeffQTM
%         utilise donc une estimation de troisième ordre pour extrapoler
%         les coefficients pour n'importe quelle valeur de b/a et génère le
%         polynôme de 9e degré correspondant.
%
%  Programming/Programmation : Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation : Institut national de la recherche scientifique (INRS)  
%  Last modification/Dernière modification : 2008-07-22                              
%--------------------------------------------------------------------------

function p = coeffQTM(ratio)

c = [0.006313 -0.00050275 -0.0018816 -0.00036248;
    -0.15601  -0.019589    0.020494   0.0083198;
     1.3689    0.38791     0.02237   -0.041419;
    -4.6546   -1.5336     -0.35339    0.10631;
     8.3977    2.9344      0.94166   -0.16603;
    -9.0127   -3.2588     -1.2535     0.16587;
     5.9594    2.2136      0.96191   -0.10636;
    -2.3861   -0.90889    -0.43195    0.04228;
     0.53121   0.20749     0.10564   -0.0094737;
    -0.050507 -0.020236   -0.010878   0.00091368];
     
x = 0:0.25:0.75;
p = zeros(1,10); 

for n = 1:1:10
    p(1,n) = polyval(polyfit(x,c(n,:),3),ratio);
end

p = fliplr(p);

end