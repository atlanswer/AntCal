%--------------------------------------------------------------------------
%                               aRing_fr.m                                   
%--------------------------------------------------------------------------
%  Analyse d'un résonateur annulaire (français)                                              
%
%    A) ENTRÉES
%
%    1. 'a' = rayon externe du résonateur (en cm)
%    2. 'b' = rayon interne du résonateur (en cm)
%    3. 'h' = hauteur du résonateur (en cm)                          
%    4. 'er' = constante diélectrique relative du résonateur         
%    5. 'VSWR' = taux d'ondes stationnaires toléré pour le calcul de la   
%       bande passante d'impédance
%
%    B) SORTIES
%
%    - La fréquence de résonance, le facteur-Q et la bande passante       
%      d'impédance pour les modes : TE01d et TM01d.
%--------------------------------------------------------------------------
%  Références :
%
%  - M. Verplanken et J. Van Bladel, "The electric dipole resonances of
%    ring resonators of very high permittivity", IEEE Transactions on 
%    microwave theory and techniques, Vol. 24, Num. 2, février 1976, pp. 
%    108-112.
%  - M. Verplanken et J. Van Bladel, "The magnetic dipole resonances of
%    ring resonators of very high permittivity", IEEE Transactions on 
%    microwave theory and techniques, Vol. 27, Num. 4, avril 1979, pp.
%    328-332
%--------------------------------------------------------------------------
%  Note : Ce fichier fait partie de l'Outil de conception et d'analyse 
%         des résonateurs diélectriques (DRA.m).
%
%  Programmation : Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation : Institut national de la recherche scientifique (INRS)  
%  Dernière modification : Le 31 juillet 2008                              
%--------------------------------------------------------------------------

function aRing_fr

% Entête :
clc
disp(strvcat('===============================================================',...
             ' Outil de conception et d''analyse des résonateur diélectriques',...
             '==============================================================='));
disp(sprintf('\n-------------- Analyse d''un résonateur annulaire ---------------'));

repeter = 1;
while repeter == 1
    repeter = 0;
    
    % Entrée des paramètres :
    a = [];
    while isempty(a)||(isnumeric(a) == 0),
        a = input('\nEntrez le rayon externe (a) du résonateur (en cm) : ');
    end

    b = [];
    while isempty(b)||(isnumeric(b) == 0),
        b = input('\nEntrez le rayon interne (b) du résonateur (en cm) : ');
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
    
    % Un avertissement est affiché si certaines limites sont dépassées :
    if (b/a > 0.75)||(h/a > 1.3)
        choix = [];
        while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3)
            choix = input(['\nAvertissement! Le ratio ''rayon interne/rayon externe'' (b/a) dépasse 0.75 et/ou\n',...
                             'le ratio ''hauteur/rayon externe'' (h/a) dépasse 1.3. Les résultats des estimations\n',...
                             'risquent d''être erronés, surtout pour le mode TE01d! Désirez-vous :\n', ...
                             '   (1) Effectuer tout de même le calcul sans modifier les valeurs entrées?\n', ...
                             '   (2) Entrer de nouvelles valeurs?\n', ...
                             '   (3) Retourner au menu principal?\n', ...
                             'Faites votre choix : ']);
        end
        switch choix
            case 1
                break
            case 2
                repeter = 1;
            case 3
                return
        end
    % Un avertissement est affiché si la constante diélectrique est plus petite que 20 :    
    elseif (er < 20 && repeter == 0)
        choix = [];
        while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3)
            choix = input(['\nAvertissement! Les approximations utilisées ne sont valides que pour une constante\n',...
                             'diélectrique élevée (er > 20). Les résultats risquent d''être erronés! Désirez-vous :\n', ...
                             '   (1) Effectuer tout de même le calcul sans modifier les valeurs entrées?\n', ...
                             '   (2) Entrer de nouvelles valeurs?\n', ...
                             '   (3) Retourner au menu principal?\n', ...
                             'Faites votre choix : ']);
        end
        switch choix
            case 1
                break
            case 2
                repeter = 1;
            case 3
                return
        end     
    end        
end

%============================%
% Calculs pour le mode TE01d %
%============================%

% Fréquence de résonance (en GHz) :
freq_TE = 4.7713*polyval(coeffTE(b/a),h/a)/sqrt(er)/a;
% Facteur-Q
facteurQ_TE = polyval(coeffQTE(b/a),h/a)*er^1.5;
% Bande passante :
BW_TE = (VSWR-1)/(sqrt(VSWR)*facteurQ_TE)*100;

%============================%
% Calculs pour le mode TM01d %
%============================%

% Fréquence de résonance (en GHz) :
freq_TM = 299792458/2/pi/sqrt(er)*sqrt((pi/2/h)^2+(calcX0(b/a)/a)^2)/1e7;
% Facteur-Q
facteurQ_TM = polyval(coeffQTM(b/a),h/a)*er^2.5;
% Bande passante :
BW_TM = (VSWR-1)/(sqrt(VSWR)*facteurQ_TM)*100;

% Entête :
clc
disp(strvcat('===============================================================',...
             ' Outil de conception et d''analyse des résonateur diélectriques',...
             '==============================================================='));
disp(sprintf('\n-------------- Analyse d''un résonateur annulaire --------------\n'));

% Affichage des paramètres d'entrée :
disp(sprintf('Rayon externe (a) du résonateur (en cm) = %5.4f',a));
disp(sprintf('Rayon interne (b) du résonateur (en cm) = %5.4f',b));
disp(sprintf('Hauteur (h) du résonateur (en cm) = %5.4f',h));
disp(sprintf('Constante diélectrique du résonateur = %5.4f',er));

% Affichage des résultats :
disp(sprintf('\n'));
disp(strvcat('                   Mode TE01d                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Fréquence de résonance (en GHz) = %5.4f',freq_TE));
disp(sprintf('                          Facteur-Q = %5.4f',facteurQ_TE));
disp(sprintf('    Bande passante (en pourcentage) = %5.4f',BW_TE));

disp(sprintf('\n'));
disp(strvcat('                   Mode TM01d                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Fréquence de résonance (en GHz) = %5.4f',freq_TM));
disp(sprintf('                          Facteur-Q = %5.4f',facteurQ_TM));
disp(sprintf('    Bande passante (en pourcentage) = %5.4f',BW_TM));

end