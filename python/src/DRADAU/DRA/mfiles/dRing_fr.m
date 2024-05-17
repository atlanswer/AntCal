%--------------------------------------------------------------------------
%                               dRing_fr.m                                   
%--------------------------------------------------------------------------
%  Conception d'un résonateur annulaire (français)                                              
%
%    A) ENTRÉES
%
%    1. 'freq' = fréquence de résonance visée                        
%    2. 'choix_mode' = mode de rayonnement choisi             
%    3. 'BW' = bande passante fractionnelle minimale désirée         
%    4. 'VSWR' = taux d'ondes stationnaires toléré pour le calcul    
%    5. 'er' = constante diélectrique relative du matériau disponible
%    6. 'ratio' = ratio 'hauteur/rayon externe' du résonateur (facultatif)
%    7. 'ratio2' = ratio 'rayon interne/rayon externe' du résonateur 
%       (facultatif)
%
%    B) SORTIES
%
%    - Les dimensions (rayon externe, rayon interne et hauteur) du 
%      résonateur qui respectent la bande passante minimale fixée pour la 
%      fréquence de résonance choisie (si le ratio 'rayon externe/hauteur' 
%      et/ou le ratio 'rayon interne/rayon externe' n'est (ne sont) pas 
%      fourni(s) par l'utilisateur, une liste des dimensions respectant ces
%      critères est générée pour la (les) plage(s) de ratios définie(s)).
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
%         des résonateurs diélectriques (DRA.m)
%
%  Programmation : Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation : Institut national de la recherche scientifique (INRS)  
%  Dernière modification : Le 31 juillet 2008                              
%--------------------------------------------------------------------------

function dRing_fr

% Entête :
clc
disp(strvcat('===============================================================',...
             ' Outil de conception et d''analyse des résonateur diélectriques',...
             '==============================================================='));
disp(sprintf('\n------------ Conception d''un résonateur annulaire -------------'));

freq = [];
while isempty(freq)||(isnumeric(freq) == 0)
   freq = input('\nEntrez la fréquence de résonance désirée (en GHz) : ');
end

choix_mode = [];
while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2)
    choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                        '   (1) Mode TE01d\n', ...
                        '   (2) Mode TM01d\n', ...
                        'Faites votre choix : ']);
end

BW = [];
while isempty(BW)||(isnumeric(BW) == 0)
   BW = input('\nEntrez la bande passante fractionelle minimale (ex.: 0.05 pour 5%) : ');
end

VSWR = [];
while isempty(VSWR)||(isnumeric(VSWR) == 0)
    VSWR = input('\nEntrez le VSWR pour le calcul de la bande passante (ex.: 2) : ');
end

er = [];
while isempty(er)||(isnumeric(er) == 0)
    er = input('\nEntrez la constante diélectrique (er) du matériau disponible : ');
end

ratio = [];
if (choix_mode == 1)
    while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 3)
        ratio = input('\nEntrez le ratio ''hauteur/rayon externe'' (h/a) désiré (0.1 <= ratio <= 3)\nou ''0'' si vous ne voulez pas le spécifier : ');
    end
else
    while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 1.3)
        ratio = input('\nEntrez le ratio ''hauteur/rayon externe'' (h/a) désiré (0.1 <= ratio <= 1.3)\nou ''0'' si vous ne voulez pas le spécifier : ');
    end
end
    
ratio2 = [];
while isempty(ratio2)||(isnumeric(ratio2) == 0)||(ratio2 < 0)||(ratio2 > 0.75)
    ratio2 = input('\nEntrez le ratio ''rayon interne/rayon externe'' (b/a) désiré (<= 0.75)\nou ''0'' si vous ne voulez pas le spécifier : ');
end

repeter = 1;
definir_plage_ratio = 1;
definir_plage_ratio2 = 1;
while (repeter == 1)
    % Détermination du facteur-Q maximal à partir du VSWR et de la bande passante spécifiée :
    facteurQ_max = (VSWR-1)/(sqrt(VSWR)*BW);
    facteurQ = [];
    % Si les ratios sont spécifiés par l'utilisateur, il faut vérifier s'il est possible d'obtenir la bande
    % passante désirée pour le mode de rayonnement choisi :
    if (ratio ~= 0 && ratio2 ~= 0)
        if (choix_mode == 1)
            facteurQ = polyval(coeffQTE(ratio2),ratio)*er^1.5;
        else 
            facteurQ = polyval(coeffQTM(ratio2),ratio)*er^2.5;
        end
        % Si ce n'est pas possible, il faut que l'utilisateur change certaines spécifications :
        if (facteurQ_max < facteurQ)
            clc
            choix = [];
            while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4 && choix ~= 5 && choix ~= 6)
                choix = input(['\nLa bande passante désirée ne peut être atteinte pour ce mode avec la\n',...
                               'combinaison de ratios et la constante diélectrique choisie. Désirez-vous :\n', ...
                               '   (1) Modifier le ratio ''hauteur/rayon externe'' (h/a) (ou ne pas en spécifier)?\n', ...
                               '   (2) Modifier le ratio ''rayon interne/rayon externe'' (b/a) (ou ne pas en spécifier)?\n', ...
                               '   (3) Modifier la constante diélectrique du résonateur?\n', ...
                               '   (4) Modifier la bande passante minimale?\n', ...
                               '   (5) Choisir un autre mode de rayonnement?\n', ...
                               '   (6) Retourner au menu principal?\n', ...                               
                               'Faites votre choix : ']);
            end

            switch choix
                case 1
                    ratio = [];
                    if (choix_mode == 1)
                        while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 3)
                            ratio = input('\nEntrez le nouveau ratio ''hauteur/rayon externe'' (h/a) désiré (0.1 <= ratio <= 3)\nou ''0'' si vous ne voulez pas le spécifier : ');
                        end
                    else
                        while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 1.3)
                            ratio = input('\nEntrez le nouveau ratio ''hauteur/rayon externe'' (h/a) désiré (0.1 <= ratio <= 1.3)\nou ''0'' si vous ne voulez pas le spécifier : ');
                        end
                    end    
                    if(ratio == 0)
                        definir_plage_ratio = 1;
                    end
                case 2
                    ratio2 = [];
                    while isempty(ratio2)||(isnumeric(ratio2) == 0)||(ratio2 < 0)||(ratio2 > 0.75)
                        ratio2 = input('\nEntrez le ratio ''rayon interne/rayon externe'' (b/a) désiré (<= 0.75)\nou ''0'' si vous ne voulez pas le spécifier : ');
                    end
                    if(ratio2 == 0)
                        definir_plage_ratio2 = 1;
                    end
                case 3
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nEntrez la nouvelle constante diélectrique du résonateur : ');
                    end
                case 4
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nEntrez la nouvelle bande passante fractionnelle minimale (ex.: 0.05 pour 5%) : ');
                    end
                case 5 
                    choix_mode = [];
                    while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2)
                        choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                                            '   (1) Mode TE01d\n', ...
                                            '   (2) Mode TM01d\n', ...
                                            'Faites votre choix : ']);
                    end
                case 6     
                    return
            end    
        
        % Lorsque tous les parametres sont corrects, on calcule les dimensions du résonateur :
        else
            if (choix_mode == 1)
                a = 4.7713*polyval(coeffTE(ratio2),ratio)/sqrt(er)/freq;
            else
                a = 299792458*sqrt(pi^2/4/ratio^2+calcX0(ratio2)^2)/(2*pi*sqrt(er)*freq)/1e7;
            end
            h = ratio*a;
            b = ratio2*a;
            BW_reelle = (VSWR-1)/(sqrt(VSWR)*facteurQ)*100;
            repeter = 0;
        end
             
    elseif(ratio ~= 0 && ratio2 == 0)
        
        if(definir_plage_ratio2 == 1)
        
            ratio2_min = [];
            while isempty(ratio2_min)||(isnumeric(ratio2_min) == 0)||(ratio2_min < 0)||(ratio2_min >= 0.75)
                ratio2_min = input('\nEntrez le ratio ''rayon interne/rayon externe'' (b/a) minimal à étudier (0 <= ratio < 0.75) : ');
            end
        
            ratio2_max = [];
            while isempty(ratio2_max)||(isnumeric(ratio2_max) == 0)||(ratio2_max <= ratio2_min)||(ratio2_max > 0.75)
                ratio2_max = input('\nEntrez le ratio ''rayon interne/rayon externe'' (b/a) maximal à étudier (<= 0.75) : ');
            end
        
            nombre = [];
            while isempty(nombre)||(isnumeric(nombre) == 0)||(nombre < 2)
                nombre = input('\nEn incluant ces limites, entrez le nombre de ratios à étudier : ');
            end
        
            definir_plage_ratio2 = 0;
        
            % Le pas de calcul représente l'incrément du ratio pour chaque série de calculs
            pas = (ratio2_max - ratio2_min)/(nombre-1);
            % Création d'une matrice pour le stockage des résultats valides
            resultats = [];
            % Indice de la ligne où entrer les résultats qui respectent les paramètres de conception 
            ligne = 1;
        end    
        
        for n = ratio2_min:pas:ratio2_max
            
            % Pour chaque valeur de n (de ratio b/a), on évalue le facteur-Q
            if (choix_mode == 1)
                facteurQ = polyval(coeffQTE(n),ratio)*er^1.5;
            else    
                facteurQ = polyval(coeffQTM(n),ratio)*er^2.5;
            end
            
            % Si le facteur-Q calculé permet d'atteindre la bande passante minimale, on calcule les 
            % dimensions du résonateur, sa bande passante réelle et on garde les résultats 
            if (facteurQ_max > facteurQ)
                if (choix_mode == 1)
                    a = 4.7713*polyval(coeffTE(n),ratio)/sqrt(er)/freq;
                else 
                    a = 299792458*sqrt(pi^2/4/ratio^2+calcX0(n)^2)/(2*pi*sqrt(er)*freq)/1e7;
                end
                h = ratio*a;
                b = n*a;
                BW_reelle = (VSWR-1)/(sqrt(VSWR)*facteurQ)*100;
                resultats(ligne,:) = [n a b h facteurQ BW_reelle]; 
                ligne = ligne+1;
            end    
        end
        
        if(ligne == 1)
            clc
            choix = [];
            while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4 && choix ~= 5)
                choix = input(['\nLa bande passante minimale ne peut être atteinte pour ce mode pour la\n',...
                               'constante diélectrique et la plage de ratios choisies. Désirez-vous :\n', ...
                               '   (1) Modifier la plage de ratios ''rayon interne/rayon externe'' (b/a) (ou fixer un ratio unique)?\n', ...
                               '   (2) Modifier la constante diélectrique du résonateur?\n', ...
                               '   (3) Modifier la bande passante minimale?\n', ...
                               '   (4) Choisir un autre mode de rayonnement?\n', ...
                               '   (5) Retourner au menu principal?\n', ...
                               'Faites votre choix : ']);
            end
            
            switch choix
                case 1
                    ratio2 = [];
                    while isempty(ratio2)||(isnumeric(ratio2) == 0)||(ratio2 < 0)||(ratio2 > 0.75)
                        ratio2 = input('\nEntrez le nouveau ratio ''rayon interne/rayon externe'' (b/a) désiré (0 < ratio <= 0.75) \nou ''0'' si vous ne voulez pas le spécifier : ');
                    end
                    if(ratio2 == 0)
                        definir_plage_ratio2 = 1;
                    end    
                case 2
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nEntrez la nouvelle constante diélectrique du résonateur : ');
                    end
                case 3
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nEntrez la nouvelle bande passante fractionnelle minimale (ex.: 0.05 pour 5%) : ');
                    end
                case 4
                    choix_mode = [];
                    while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2)
                        choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                                            '   (1) Mode TE01d\n', ...
                                            '   (2) Mode TM01d\n', ...
                                            'Faites votre choix : ']);
                    end
                case 5    
                    return
            end
            
        else
            repeter = 0;
        end

    elseif(ratio == 0 && ratio2 ~= 0)
        
        if(definir_plage_ratio == 1)
        
            ratio_min = [];
            ratio_max = [];
            
            if (choix_mode == 1)
                while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min < 0.1)||(ratio_min >= 3)
                    ratio_min = input('\nEntrez le ratio ''hauteur/rayon externe'' (h/a) minimal à étudier (0.1 <= ratio < 3) : ');
                end
                while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)||(ratio_max > 3)
                    ratio_max = input('\nEntrez le ratio ''hauteur/rayon externe'' (h/a) maximal à étudier (<= 3) : ');
                end
            else
                while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min < 0.1)||(ratio_min >= 1.3)
                    ratio_min = input('\nEntrez le ratio ''hauteur/rayon externe'' (h/a) minimal à étudier (0.1 <= ratio < 1.3) : ');
                end
                while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)||(ratio_max > 1.3)
                    ratio_max = input('\nEntrez le ratio ''hauteur/rayon externe'' (h/a) maximal à étudier (<= 1.3) : ');
                end
            end    
        
            nombre = [];
            while isempty(nombre)||(isnumeric(nombre) == 0)||(nombre < 2)
                nombre = input('\nEn incluant ces limites, entrez le nombre de ratios à étudier : ');
            end
        
            definir_plage_ratio = 0;
        
            % Le pas de calcul représente l'incrément du ratio pour chaque série de calculs
            pas = (ratio_max - ratio_min)/(nombre-1);
            % Création d'une matrice pour le stockage des résultats valides
            resultats = [];
            % Indice de la ligne où entrer les résultats qui respectent les paramètres de conception 
            ligne = 1;
        end    
        
        for n = ratio_min:pas:ratio_max
            
            % Pour chaque valeur de n (de ratio h/a), on évalue le facteur-Q
            if (choix_mode == 1)
                facteurQ = polyval(coeffQTE(ratio2),n)*er^1.5;
            else    
                facteurQ = polyval(coeffQTM(ratio2),n)*er^2.5;
            end
            
            % Si le facteur-Q calculé permet d'atteindre la bande passante minimale, on calcule les 
            % dimensions du résonateur, sa bande passante réelle et on garde les résultats
            if (facteurQ_max > facteurQ)
                if (choix_mode == 1)
                    a = 4.7713*polyval(coeffTE(ratio2),n)/sqrt(er)/freq;
                else 
                    a = 299792458*sqrt(pi^2/4/n^2+calcX0(ratio2)^2)/(2*pi*sqrt(er)*freq)/1e7;
                end
                h = n*a;
                b = ratio2*a;
                BW_reelle = (VSWR-1)/(sqrt(VSWR)*facteurQ)*100;
                resultats(ligne,:) = [n a b h facteurQ BW_reelle]; 
                ligne = ligne+1;
            end    
        end
        
        if(ligne == 1)
            clc
            choix = [];
            while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4 && choix ~= 5)
                choix = input(['\nLa bande passante minimale ne peut être atteinte pour ce mode pour la\n',...
                               'constante diélectrique et la plage de ratios choisies. Désirez-vous :\n', ...
                               '   (1) Modifier la plage de ratios ''hauteur/rayon externe'' (h/a) (ou fixer un ratio unique)?\n', ...
                               '   (2) Modifier la constante diélectrique du résonateur?\n', ...
                               '   (3) Modifier la bande passante minimale?\n', ...
                               '   (4) Choisir un autre mode de rayonnement?\n', ...
                               '   (5) Retourner au menu principal?\n', ...
                               'Faites votre choix : ']);
            end
            
            switch choix
                case 1
                    ratio = [];
                    if (choix_mode == 1)
                        while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 3)
                            ratio = input('\nEntrez le nouveau ratio ''hauteur/rayon externe'' (h/a) désiré (0.1 <= ratio <= 3)\nou ''0'' si vous ne voulez pas le spécifier : ');
                        end
                    else
                        while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 1.3)
                            ratio = input('\nEntrez le nouveau ratio ''hauteur/rayon externe'' (h/a) désiré (0.1 <= ratio <= 1.3)\nou ''0'' si vous ne voulez pas le spécifier : ');
                        end
                    end
                    if(ratio == 0)
                        definir_plage_ratio = 1;
                    end    
                case 2
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nEntrez la nouvelle constante diélectrique du résonateur : ');
                    end
                case 3
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nEntrez la nouvelle bande passante fractionnelle minimale (ex.: 0.05 pour 5%) : ');
                    end
                case 4
                    choix_mode = [];
                    while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2)
                        choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                                            '   (1) Mode TE01d\n', ...
                                            '   (2) Mode TM01d\n', ...
                                            'Faites votre choix : ']);
                    end
                case 5    
                    return
            end
            
        else
            repeter = 0;
        end
        
    else
        if(definir_plage_ratio == 1)

            ratio_min = [];
            ratio_max = [];
            
            if (choix_mode == 1)
                while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min < 0.1)||(ratio_min >= 3)
                    ratio_min = input('\nEntrez le ratio ''hauteur/rayon externe'' (h/a) minimal à étudier (0.1 <= ratio < 3) : ');
                end
                while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)||(ratio_max > 3)
                    ratio_max = input('\nEntrez le ratio ''hauteur/rayon externe'' (h/a) maximal à étudier (<= 3) : ');
                end
            else
                while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min < 0.1)||(ratio_min >= 1.3)
                    ratio_min = input('\nEntrez le ratio ''hauteur/rayon externe'' (h/a) minimal à étudier (0.1 <= ratio < 1.3) : ');
                end
                while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)||(ratio_max > 1.3)
                    ratio_max = input('\nEntrez le ratio ''hauteur/rayon externe'' (h/a) maximal à étudier (<= 1.3) : ');
                end
            end     
        
            nombre = [];
            while isempty(nombre)||(isnumeric(nombre) == 0)||(nombre < 2)
                nombre = input('\nEn incluant ces limites, entrez le nombre de ratios à étudier : ');
            end
        
            definir_plage_ratio = 0;
        
            % Le pas de calcul représente l'incrément du ratio pour chaque série de calculs
            pas = (ratio_max - ratio_min)/(nombre-1);
            % Création d'une matrice pour le stockage des résultats valides
            resultats = [];
            % Indice de la ligne où entrer les résultats qui respectent les paramètres de conception 
            ligne = 1;
        end
        
        if(definir_plage_ratio2 == 1)

            ratio2_min = [];
            while isempty(ratio2_min)||(isnumeric(ratio2_min) == 0)||(ratio2_min < 0)||(ratio2_min >= 0.75)
                ratio2_min = input('\nEntrez le ratio ''rayon interne/rayon externe'' (b/a) minimal à étudier (0 < ratio < 0.75) : ');
            end
        
            ratio2_max = [];
            while isempty(ratio2_max)||(isnumeric(ratio2_max) == 0)||(ratio2_max <= ratio2_min)||(ratio2_max > 0.75)
                ratio2_max = input('\nEntrez le ratio ''rayon interne/rayon externe'' (b/a) maximal à étudier (<= 0.75) : ');
            end
        
            nombre2 = [];
            while isempty(nombre2)||(isnumeric(nombre2) == 0)||(nombre2 < 2)
                nombre2 = input('\nEn incluant ces limites, entrez le nombre de ratios à étudier : ');
            end
        
            definir_plage_ratio2 = 0;
        
            % Le pas de calcul représente l'incrément du ratio pour chaque série de calculs
            pas2 = (ratio2_max - ratio2_min)/(nombre2-1);
            % Création d'une matrice pour le stockage des résultats valides
            resultats = [];
            % Indice de la ligne où entrer les résultats qui respectent les paramètres de conception 
            ligne = 1;
        end
        
        for n = ratio_min:pas:ratio_max
            for m = ratio2_min:pas2:ratio2_max 
                % Pour chaque valeur de n et m (de ratio h/a et de ratio b/a), on évalue le facteur-Q
                if (choix_mode == 1)
                    facteurQ = polyval(coeffQTE(m),n)*er^1.5;
                else    
                    facteurQ = polyval(coeffQTM(m),n)*er^2.5;
                end
            
                % Si le facteur-Q calculé permet d'atteindre la bande passante minimale, on calcule les 
                % dimensions du résonateur, sa bande passante réelle et on garde les résultats
                if (facteurQ_max > facteurQ)
                    if (choix_mode == 1)
                        a = 4.7713*polyval(coeffTE(m),n)/sqrt(er)/freq;
                    else 
                        a = 299792458*sqrt(pi^2/4/n^2+calcX0(m)^2)/(2*pi*sqrt(er)*freq)/1e7;
                    end
                    h = n*a;
                    b = m*a;
                    BW_reelle = (VSWR-1)/(sqrt(VSWR)*facteurQ)*100;
                    resultats(ligne,:) = [n m a b h facteurQ BW_reelle]; 
                    ligne = ligne+1;
                end    
            end
        end
        
        if(ligne == 1)
            clc
            choix = [];
            while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4 && choix ~= 5 && choix ~= 6)
                choix = input(['\nLa bande passante minimale ne peut être atteinte pour ce mode pour la\n',...
                               'constante diélectrique et la plage de ratios choisies. Désirez-vous :\n', ...
                               '   (1) Modifier la plage de ratios ''hauteur/rayon externe'' (h/a) (ou fixer un ratio unique)?\n', ...
                               '   (2) Modifier la plage de ratios ''rayon externe/rayon interne'' (b/a) (ou fixer un ratio unique)?\n', ...
                               '   (3) Modifier la constante diélectrique du résonateur?\n', ...
                               '   (4) Modifier la bande passante minimale?\n', ...
                               '   (5) Choisir un autre mode de rayonnement?\n', ...
                               '   (6) Retourner au menu principal?\n', ...
                               'Faites votre choix : ']);
            end
            
            switch choix
                case 1
                    ratio = [];
                    if (choix_mode == 1)
                        while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 3)
                            ratio = input('\nEntrez le nouveau ratio ''hauteur/rayon externe'' (h/a) désiré (0.1 <= ratio <= 3)\nou ''0'' si vous ne voulez pas le spécifier : ');
                        end
                    else
                        while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 1.3)
                            ratio = input('\nEntrez le nouveau ratio ''hauteur/rayon externe'' (h/a) désiré (0.1 <= ratio <= 1.3)\nou ''0'' si vous ne voulez pas le spécifier : ');
                        end
                    end
                    if(ratio == 0)
                        definir_plage_ratio = 1;
                    end
                case 2
                    ratio2 = [];
                    while isempty(ratio2)||(isnumeric(ratio2) == 0)||(ratio2 < 0)||(ratio2 > 0.75)
                        ratio2 = input('\nEntrez le nouveau ratio ''rayon interne/rayon externe'' (b/a) désiré (0 < ratio <= 0.75) \nou ''0'' si vous ne voulez pas le spécifier : ');
                    end
                    if(ratio2 == 0)
                        definir_plage_ratio2 = 1;
                    end
                case 3
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nEntrez la nouvelle constante diélectrique du résonateur : ');
                    end
                case 4
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nEntrez la nouvelle bande passante fractionnelle minimale (ex.: 0.05 pour 5%) : ');
                    end
                case 5
                    choix_mode = [];
                    while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2)
                        choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                                            '   (1) Mode TE01d\n', ...
                                            '   (2) Mode TM01d\n', ...
                                            'Faites votre choix : ']);
                    end
                case 6    
                    return
            end
        else
            repeter = 0;
        end    
    end
    
    if (repeter == 0)
        
        % Entête :
        clc
        disp(strvcat('===============================================================',...
                     ' Outil de conception et d''analyse des résonateur diélectriques',...
                     '==============================================================='));
        disp(sprintf('\n------------ Conception d''un résonateur annulaire -------------\n'));

        % Affichage des paramètres d'entrée :
        disp(sprintf('Fréquence de résonance (en GHz) = %5.4f',freq));
    
        if (choix_mode == 1)
            disp(sprintf('Mode de rayonnement = TE01d'));
        else  
            disp(sprintf('Mode de rayonnement = TM01d'));
        end
    
        disp(sprintf('Bande passante fractionnelle minimale = %5.4f',BW));
        disp(sprintf('VSWR pour le calcul de la bande passante = %5.4f',VSWR));
        disp(sprintf('Constante diélectrique du résonateur = %5.4f',er));
        
        % Affichage des résultats :
        if (ratio ~= 0 && ratio2 ~= 0)
            disp(sprintf('Ratio ''hauteur/rayon externe'' (h/a) = %5.4f',ratio));
            disp(sprintf('Ratio ''rayon interne/rayon externe'' (b/a) = %5.4f',ratio2));
            
            disp(sprintf('\n'));
            disp(strvcat('        Résultats pour le mode choisi', ...
                         '--------------------------------------------'));
            disp(sprintf('Rayon interne (b) du résonateur (en cm) = %5.4f',b));
            disp(sprintf('Rayon externe (a) du résonateur (en cm) = %5.4f',a));
            disp(sprintf('Hauteur (h) du résonateur (en cm) = %5.4f',h));
            disp(sprintf('Facteur-Q = %5.4f',facteurQ));
            disp(sprintf('Bande passante (en pourcentage) = %5.4f',BW_reelle));
            
        elseif (ratio ~= 0 && ratio2 == 0)
            disp(sprintf('Ratio ''hauteur/rayon externe'' (h/a) = %5.4f',ratio));
            disp(sprintf('Ratio ''rayon interne/rayon externe'' (b/a) minimal = %5.4f',ratio2_min));
            disp(sprintf('Ratio ''rayon interne/rayon externe'' (b/a) maximal = %5.4f',ratio2_max));
            disp(sprintf('Nombre de ratios à étudier = %5.5f',nombre));
            
            disp(sprintf('\n'));
            disp(strvcat('                  Résultats pour le mode choisi', ...                   
                         '===================================================================='));
            disp('b/a         a           b           h           facteurQ    BW');   
            disp('--------------------------------------------------------------------');
            for n = 1:1:size(resultats,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',resultats(n,:)));
            end
        elseif (ratio == 0 && ratio2 ~= 0)
            disp(sprintf('Ratio ''rayon interne/rayon externe'' (b/a) = %5.4f',ratio2));
            disp(sprintf('Ratio ''hauteur/rayon externe'' (h/a) minimal = %5.4f',ratio_min));
            disp(sprintf('Ratio ''hauteur/rayon externe'' (h/a) maximal = %5.4f',ratio_max));
            disp(sprintf('Nombre de ratios à étudier = %5.4f',nombre));
            
            disp(sprintf('\n'));
            disp(strvcat('                  Résultats pour le mode choisi', ...     
                         '===================================================================='));
            disp('h/a         a           b           h           facteurQ    BW');
            disp('--------------------------------------------------------------------');
            for n = 1:1:size(resultats,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',resultats(n,:)));
            end
        else
            disp(sprintf('Ratio ''hauteur/rayon externe'' (h/a) minimal = %5.4f',ratio_min));
            disp(sprintf('Ratio ''hauteur/rayon externe'' (h/a) maximal = %5.4f',ratio_max));
            disp(sprintf('Nombre de ratios à étudier = %5.4f',nombre));
            disp(sprintf('\n'));
            disp(sprintf('Ratio ''rayon interne/rayon externe'' (b/a) minimal = %5.4f',ratio2_min));
            disp(sprintf('Ratio ''rayon interne/rayon externe'' (b/a) maximal = %5.4f',ratio2_max));
            disp(sprintf('Nombre de ratios à étudier = %5.4f',nombre2));
            
            disp(sprintf('\n'));
            disp(strvcat('                         Résultats pour le mode choisi', ...                              
                         '================================================================================'));
            disp('h/a         b/a         a           b           h           facteurQ    BW');
            disp('--------------------------------------------------------------------------------');
            for n = 1:1:size(resultats,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',resultats(n,:)));
            end    
        end
    end
end

end