%--------------------------------------------------------------------------
%                                dHemi_fr.m                                   
%--------------------------------------------------------------------------
%  Conception d'un résonateur hémisphérique (français)                                              
%
%    A) ENTRÉES
%
%    1. 'freq' = fréquence de résonance visée                        
%    2. 'choix_mode' = mode de rayonnement choisi             
%    3. 'er' = constante diélectrique du matériau disponible (facultatif)
%    4. 'BW' = bande passante fractionnelle minimale (ou exacte) désirée         
%    5. 'VSWR' = taux d'ondes stationnaires toléré pour le calcul    
%       de la bande passante d'impédance
%
%    B) SORTIES
%
%    - Rayon du résonateur, facteur Q, bande passante d'impédance et 
%      constante diélectrique relative (si non spécifiée).
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
%  Dernière modification : Le 31 juillet 2008                              
%--------------------------------------------------------------------------

function dHemi_fr

% Entête :
clc
disp(strvcat('===============================================================',...
             ' Outil de conception et d''analyse des résonateur diélectriques',...
             '==============================================================='));
disp(sprintf('\n--------- Conception d''un résonateur hémisphérique ------------'));

% Entrée des paramètres
freq = [];
while isempty(freq)||(isnumeric(freq) == 0)
   freq = input('\nEntrez la fréquence de résonance désirée (en GHz) : ');
end

choix_mode = [];
while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2)
    choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                        '   (1) Mode TE111 (maximum au flanc)\n', ...
                        '   (2) Mode TM101 (zéro au flanc)\n', ...
                        'Faites votre choix : ']);
end

er = [];
while isempty(er)||(isnumeric(er) == 0),
   er = input('\nEntrez la constante diélectrique du résonateur\nou ''0'' si vous ne voulez pas la spécifier : ');
end

BW = [];
if (er ~= 0)
    while isempty(BW)||(isnumeric(BW) == 0)
        BW = input('\nEntrez la bande passante fractionelle minimale (ex.: 0.05 pour 5%) : ');
    end
else
    while isempty(BW)||(isnumeric(BW) == 0)
        BW = input('\nEntrez la bande passante fractionelle désirée (ex.: 0.05 pour 5%) : ');
    end
end    

VSWR = [];
while isempty(VSWR)||(isnumeric(VSWR) == 0)
    VSWR = input('\nEntrez le VSWR pour le calcul de la bande passante (ex.: 2) : ');
end

repeter = 1;
while (repeter == 1)
    
    % Calcul du facteur Q à partir de la bande passante spécifiée :
    facteurQ_max = (VSWR-1)/(sqrt(VSWR)*BW);
    facteurQ = [];

    % Si la constante diélectrique est spécifiée par l'utilisateur, il faut
    % vérifier s'il est possible d'obtenir la bande passante désirée pour le
    % mode de rayonnement choisi :
    if(er ~= 0)
        switch choix_mode
            case 1
                facteurQ = 0.08+0.796*er+0.01226*er^2-3e-5*er^3;
                ka = 2.8316*er^-0.47829;
            case 2
                if (er <= 20)
                    facteurQ = 0.723+0.9324*er-0.0956*er^2+0.00403*er^3-5e-5*er^4;
                else
                    facteurQ = 2.621-0.574*er+0.02812*er^2+2.59e-4*er^3;
                end
                ka = 4.47226*er^-0.505;
        end
        
        % Si ce n'est pas possible, il faut que l'utilisateur change certaines spécifications :
        if (facteurQ_max < facteurQ)
            choix = [];
            while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4)
                choix = input(['\nLa bande passante minimale ne peut être atteinte pour ce mode pour la\n',...
                               'constante diélectrique choisie. Désirez-vous :\n', ...
                               '   (1) Modifier la constante diélectrique du résonateur?\n', ...
                               '   (2) Modifier la bande passante minimale?\n', ...
                               '   (3) Choisir un autre mode de rayonnement?\n', ...
                               '   (4) Retourner au menu principal?\n', ...
                               'Faites votre choix : ']);
            end
            
            switch choix
                case 1
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nEntrez la nouvelle constante diélectrique du résonateur\nou ''0'' si vous ne voulez pas la spécifier : ');
                    end
                case 2
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nEntrez la nouvelle bande passante fractionnelle minimale (ex.: 0.05 pour 5%) : ');
                    end
                case 3
                    choix_mode = [];
                    while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2)
                        choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                                            '   (1) Mode TE111 (maximum au flanc)\n', ...
                                            '   (2) Mode TM101 (zéro au flanc)\n', ...
                                            'Faites votre choix : ']);
                    end
                case 4    
                    return
            end

        
        else
            repeter = 0;
        end    

    else
        switch choix_mode
        case 1
            er_calc = fsolve(@(x)0.08+0.796*x+0.01226*x^2-3e-5*x^3-facteurQ_max,50);
            ka = 2.8316*er_calc^-0.47829;
        case 2
            if (facteurQ_max <= 5.371)
                er_calc = fsolve(@(x)0.723+0.9324*x-0.0956*x^2+0.00403*x^3-5e-5*x^4-facteurQ_max,10);
            else
                er_calc = fsolve(@(x)2.621-0.574*x+0.02812*x^2+2.59e-4*x^3-facteurQ_max,60);
            end
            ka = 4.47226*er_calc^-0.505;
        end

        % Un message d'erreur est affiché si le constante diélectrique
        % calculée est plus petite que 1 :
        if (er_calc < 1)
            choix = [];
            while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4)
                choix = input(['\nLa bande passante désirée ne peut être atteinte pour ce mode car la constante\n',...
                               'diélectrique requise est physiquement irréalisable (er < 1). Désirez-vous :\n', ...
                               '   (1) Spécifier une constante diélectrique?\n', ...
                               '   (2) Modifier la bande passante désirée?\n', ...
                               '   (3) Choisir un autre mode de rayonnement?\n', ...
                               '   (4) Retourner au menu principal?\n', ...
                               'Faites votre choix : ']);
            end
            
            switch choix
                case 1
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nEntrez la constante diélectrique du résonateur : ');
                    end
                case 2
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nEntrez la nouvelle bande passante fractionnelle désirée (ex.: 0.05 pour 5%) : ');
                    end
                case 3
                    choix_mode = [];
                    while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2)
                        choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                                            '   (1) Mode TE111 (maximum au flanc)\n', ...
                                            '   (2) Mode TM101 (zéro au flanc)\n', ...
                                            'Faites votre choix : ']);
                    end
                case 4    
                    return
            end
        else
            repeter = 0;
        end    
    end
    
    if (repeter == 0)
        
        % Lorsque tous les paramètres sont corrects, le rayon du résonateur est calculé :
        a = 4.7713*ka/freq;
        
        % Calcul de la bande passante obtenue (si une constante diélectrique est spécifiée) :
        if (er ~= 0)
            BW_reelle = (VSWR-1)/(sqrt(VSWR)*facteurQ)*100;
        end    
          
        % Entête :
        clc
        disp(strvcat('===============================================================',...
                     ' Outil de conception et d''analyse des résonateur diélectriques',...
                     '==============================================================='));
        disp(sprintf('\n--------- Conception d''un résonateur hémisphérique ------------\n'));

        % Affichage des paramètres d'entrée :
        disp(sprintf('Fréquence de résonance désirée (en GHz) = %5.4f',freq));
    
        if (choix_mode == 1)
            disp(sprintf('Mode de rayonnement = TE111'));
        else
            disp(sprintf('Mode de rayonnement = TM101'));
        end

        if (er ~= 0)
            disp(sprintf('Bande passante fractionnelle minimale = %5.4f',BW));
        else
            disp(sprintf('Bande passante fractionnelle désirée = %5.4f',BW));
        end
        
        disp(sprintf('VSWR pour le calcul de la bande passante = %5.4f',VSWR));
        
        if (er ~= 0)
            disp(sprintf('Constante diélectrique du résonateur = %5.4f',er));
        end
        
        % Affichage des résultats :
        disp(sprintf('\n'));
        disp(strvcat('       Résultats pour le mode choisi        ', ...
                     '--------------------------------------------'));
        disp(sprintf('     Rayon (a) du résonateur (en cm) = %5.4f',a));
        if (er == 0)
            disp(sprintf('Constante diélectrique du résonateur = %5.4f',er_calc));
            disp(sprintf('                           Facteur-Q = %5.4f',facteurQ_max));
        else
            disp(sprintf('                           Facteur-Q = %5.4f',facteurQ));
            disp(sprintf('     Bande passante (en pourcentage) = %5.4f',BW_reelle));
        end
    end
end

end