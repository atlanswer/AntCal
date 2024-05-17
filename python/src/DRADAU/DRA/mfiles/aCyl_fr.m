%--------------------------------------------------------------------------
%                                aCyl_fr.m                                   
%--------------------------------------------------------------------------
%  Analyse d'un résonateur cylindrique (français)                                              
%
%    A) ENTRÉES
%
%    1. 'a' = rayon du résonateur (en cm)                            
%    2. 'h' = hauteur du résonateur (en cm)                          
%    3. 'er' = constante diélectrique relative du résonateur         
%    4. 'VSWR' = taux d'ondes stationnaires toléré pour le calcul de la   
%       bande passante d'impédance
%
%    B) SORTIES
%
%    - La fréquence de résonance, le facteur-Q et la bande passante       
%      d'impédance pour les modes : TE01d, HE11d, EH11d et TM01d.
%--------------------------------------------------------------------------
%  Références :
%
%  - R.K. Mongia et P. Barthia, "Dielectric resonator antennas - A review
%    and general design relations for resonant frequency and bandwidth",
%    International journal of microwave and millimeter-wave computer-
%    aided engineering, Vol. 4, Num. 3, 1994, pp. 230-247.
%  - A.A. Kishk, A.W. Glisson et G.P. Junker, "Study of broadband
%    dielectric resonator antennas", 1999 Antenna applications symposium,
%    septembre 1999, Allerton Park, Monticello (Il), pp. 45-68. 
%--------------------------------------------------------------------------  
%  Note : Ce fichier fait partie de l'Outil de conception et d'analyse 
%         des résonateurs diélectriques (DRA.m).
%
%  Programmation : Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation : Institut national de la recherche scientifique (INRS)  
%  Dernière modification : Le 31 juillet 2008                              
%--------------------------------------------------------------------------

function aCyl_fr

% Entête :
clc
disp(strvcat('===============================================================',...
             ' Outil de conception et d''analyse des résonateur diélectriques',...
             '==============================================================='));
disp(sprintf('\n----------- Analyse d''un résonateur cylindrique ---------------'));

% Entrée des paramètres :
a = [];
while isempty(a)||(isnumeric(a) == 0),
   a = input('\nEntrez le rayon (a) du résonateur (en cm) : ');
end

h = [];
while isempty(h)||(isnumeric(h) == 0),
   h = input('\nEntrez la hauteur (h) du résonateur (en cm) : ');
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
% Calculs pour le mode TE01d %
%============================%

% Fréquence de résonance (en GHz) :
freq_TE = 4.7713*((2.327/sqrt(er+1))*(1+0.2123*(a/h)-0.00898*(a/h)^2))/a;
% Facteur-Q :
facteurQ_TE = 0.078192*er^1.27*(1+17.31*(h/a)-21.57*(h/a)^2+10.86*(h/a)^3-1.98*(h/a)^4);
% Bande passante :
BW_TE = (VSWR-1)/(sqrt(VSWR)*facteurQ_TE)*100;

%============================%
% Calculs pour le mode HE11d %
%============================%

% Fréquence de résonance (en GHz) :
freq_HE = 4.7713*((6.324/sqrt(er+2))*(0.27+0.36*a/(2*h)+0.02*(a/(2*h))^2))/a;
% facteur-Q :
facteurQ_HE = 0.01007*er^1.3*(a/h)*(1+100*exp(-2.05*(a/(2*h)-1/80*(a/h)^2)));
% Bande passante :
BW_HE = (VSWR-1)/(sqrt(VSWR)*facteurQ_HE)*100;

%============================%
% Calculs pour le mode EH11d %
%============================%

% Fréquence de résonance (en GHz) :
freq_EH11 = 4.7713*((3.72+0.4464*a/2/h+0.2232*(a/2/h)^2+0.0521*(a/2/h)^3-2.65*exp(-1.25*a/2/h*(1+4.7*a/2/h)))/sqrt(er))/a;
% facteur-Q :
facteurQ_EH11 = er^2*(0.068-0.0388*a/2/h+0.0064*(a/2/h)^2+0.0007*exp(a/2/h*(37.59-63.8*a/2/h)));
% Bande passante :
BW_EH11 = (VSWR-1)/(sqrt(VSWR)*facteurQ_EH11)*100;

%============================%
% Calculs pour le mode TM01d %
%============================%

% Fréquence de résonance (en GHz) :
freq_TM = 4.7713*(sqrt(3.83^2+((pi*a)/(2*h))^2)/sqrt(er+2))/a;
% facteur-Q :
facteurQ_TM = 0.008721*er^0.888413*exp(0.0397475*er)*(1-(0.3-0.2*a/h)*((38-er)/28))*...
              (9.498186*a/h+2058.33*(a/h)^4.322261*exp(-3.50099*(a/h)));
% Bande passante :
BW_TM = (VSWR-1)/(sqrt(VSWR)*facteurQ_TM)*100;

% Entête :
clc
disp(strvcat('===============================================================',...
             ' Outil de conception et d''analyse des résonateur diélectriques',...
             '==============================================================='));
disp(sprintf('\n----------- Analyse d''un résonateur cylindrique ---------------\n'));

% Affichage des paramètres d'entrée :
disp(sprintf('Rayon (a) du résonateur (en cm) = %5.4f',a));
disp(sprintf('Hauteur (h) du résonateur (en cm) = %5.4f',h));
disp(sprintf('Constante diélectrique du résonateur = %5.4f',er));
disp(sprintf('VSWR pour le calcul de la bande passante = %5.4f',VSWR));

% Affichage des résultats :
disp(sprintf('\n'));
disp(strvcat('                   Mode TE01d                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Fréquence de résonance (en GHz) = %5.4f',freq_TE));
disp(sprintf('                          Facteur-Q = %5.4f',facteurQ_TE));
disp(sprintf('    Bande passante (en pourcentage) = %5.4f',BW_TE));

disp(sprintf('\n'));
disp(strvcat('                   Mode HE11d                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Fréquence de résonance (en GHz) = %5.4f',freq_HE));
disp(sprintf('                          Facteur-Q = %5.4f',facteurQ_HE));
disp(sprintf('    Bande passante (en pourcentage) = %5.4f',BW_HE));

disp(sprintf('\n'));
disp(strvcat('                   Mode EH11d                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Fréquence de résonance (en GHz) = %5.4f',freq_EH11));
disp(sprintf('                          Facteur-Q = %5.4f',facteurQ_EH11));
disp(sprintf('    Bande passante (en pourcentage) = %5.4f',BW_EH11));

disp(sprintf('\n'));
disp(strvcat('                   Mode TM01d                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Fréquence de résonance (en GHz) = %5.4f',freq_TM));
disp(sprintf('                          Facteur-Q = %5.4f',facteurQ_TM));
disp(sprintf('    Bande passante (en pourcentage) = %5.4f',BW_TM));

end