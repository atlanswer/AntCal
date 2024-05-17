%--------------------------------------------------------------------------
%                                aHemi_fr.m                                   
%--------------------------------------------------------------------------
%  Analyse d'un résonateur hémisphérique (français)                                              
%
%    A) ENTRÉES
%    
%    1. 'a' = rayon du résonateur (en cm)
%    2. 'er' = constante diélectrique relative du résonateur
%    3. 'VSWR' = taux d'ondes stationnaires toléré pour le calcul    
%       de la bande passante d'impédance
%
%    B) SORTIES
%    
%    - Fréquence de résonance, facteur Q et bande passante d'impédance
%      pour les deux premiers modes : TE111 et TM101.
%--------------------------------------------------------------------------
%  Référence :
%
%  - M. Gastine, L. Courtois et J.J. Dormann, "Electromagnetic resonances
%    of free dielectric spheres", IEEE Transactions on microwave theory
%    and techniques, Vol. 15, Num. 12, décembre 1967, pp. 694-700.
%--------------------------------------------------------------------------
%  Note : Ce fichier fait partie de l'Outil de conception et d'analyse 
%         des résonateurs diélectriques (DRA.m). Les équations d'estimation
%         sont tirées du livre "Dielectric resonator antenna handbook" de
%         Also Petosa.
%
%  Programmation : Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation : Institut national de la recherche scientifique (INRS)  
%  Dernière modification : Le 22 juillet 2008                              
%--------------------------------------------------------------------------

function aHemi_fr

% Entête :
clc
disp(strvcat('===============================================================',...
             ' Outil de conception et d''analyse des résonateur diélectriques',...
             '==============================================================='));
disp(sprintf('\n----------- Analyse d''un résonateur hémisphérique -------------'));

% Entrée des paramètres :
a = [];
while isempty(a)||(isnumeric(a) == 0),
   a = input('\nEntrez le rayon (a) du résonateur (en cm) : ');
end

er = [];
while isempty(er)||(isnumeric(er) == 0),
   er = input('\nEntrez la constante diélectrique (er) du résonateur : ');
end

VSWR = [];
while isempty(VSWR)||(isnumeric(VSWR) == 0),
   VSWR = input('\nEntrez le VSWR pour le calcul de la bande passante (ex.: 2) : ');
end

%============================%
% Calculs pour le mode TE111 %
%============================%

% Fréquence de résonance (en GHz) :
freq_TE = 2.8316*er^-0.47829*4.7713/a;
% Facteur Q :
facteurQ_TE = 0.08+0.796*er+0.01226*er^2-3e-5*er^3;
% Bande passante :
BW_TE = (VSWR-1)/(sqrt(VSWR)*facteurQ_TE)*100;

%============================%
% Calculs pour le mode TM101 %
%============================%

% Fréquence de résonance (en GHz) :
freq_TM = 4.47226*er^-0.505*4.7713/a;
% Facteur Q :
if (er <= 20)
    facteurQ_TM = 0.723+0.9324*er-0.0956*er^2+0.00403*er^3-5e-5*er^4;
else
    facteurQ_TM = 2.621-0.574*er+0.02812*er^2+2.59e-4*er^3;
end
% Bande passante :
BW_TM = (VSWR-1)/(sqrt(VSWR)*facteurQ_TM)*100;

% Entête :
clc
disp(strvcat('===============================================================',...
             ' Outil de conception et d''analyse des résonateur diélectriques',...
             '==============================================================='));
disp(sprintf('\n----------- Analyse d''un résonateur hémisphérique -------------\n'));

% Affichage des paramètres d'entrée :
disp(sprintf('Rayon (a) du résonateur (en cm) = %5.4f',a));
disp(sprintf('Constante diélectrique du résonateur = %5.4f',er));
disp(sprintf('VSWR pour le calcul de la bande passante = %5.4f',VSWR));

% Affichage des résultats :
disp(sprintf('\n'));
disp(strvcat('                   Mode TE111                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Fréquence de résonance (en GHz) = %5.4f',freq_TE));
disp(sprintf('                          Facteur-Q = %5.4f',facteurQ_TE));
disp(sprintf('    Bande passante (en pourcentage) = %5.4f',BW_TE));

disp(sprintf('\n'));
disp(strvcat('                   Mode TM101                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Fréquence de résonance (en GHz) = %5.4f',freq_TM));
disp(sprintf('                          Facteur-Q = %5.4f',facteurQ_TM));
disp(sprintf('    Bande passante (en pourcentage) = %5.4f',BW_TM));

end