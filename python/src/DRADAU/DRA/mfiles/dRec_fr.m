%--------------------------------------------------------------------------
%                                dRec_fr.m                                   
%--------------------------------------------------------------------------
%  Conception d'un résonateur rectangulaire (français)                                              
%
%    A) ENTRÉES
%
%    1. 'freq' = fréquence de résonance visée                        
%    2. 'choix_mode' = mode de rayonnement choisi             
%    3. 'BW' = bande passante fractionnelle minimale désirée         
%    4. 'VSWR' = taux d'ondes stationnaires toléré pour le calcul    
%    5. 'er' = constante diélectrique relative du matériau disponible
%    6. 'ratio' = ratio 'largeur/hauteur' du résonateur (facultatif)
%    7. 'ratio2' = ratio 'profondeur/hauteur' du résonateur (facultatif)
%
%    B) SORTIES
%
%    - Les dimensions (largeur, profondeur et hauteur) du résonateur qui
%      respectent la bande passante minimale fixée pour la fréquence de
%      résonance choisie (si le ratio 'largeur/hauteur' et/ou le ratio
%      'profondeur/hauteur' n'est (ne sont) pas fourni(s) par
%      l'utilisateur, une liste des dimensions respectant ces critères est 
%      générée pour la (les) plage(s) de ratios définie(s)).
%--------------------------------------------------------------------------
%  Référence :
%
%  - R.K. Mongia et A. Ittipiboon, "Theoretical and experimental
%    investigations on rectangular dielectric resonator antennas", IEEE
%    Transactions on antennas and propagation, Vol. 45, Num. 9, septembre
%    1997, pp. 1348-1356.
%--------------------------------------------------------------------------
%  Note : Ce fichier fait partie de l'Outil de conception et d'analyse 
%         des résonateurs diélectriques (DRA.m).
%
%  Programmation : Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation : Institut national de la recherche scientifique (INRS)  
%  Dernière modification : Le 31 juillet 2008                              
%--------------------------------------------------------------------------

function dRec_fr

% Entête :
clc
disp(strvcat('===============================================================',...
             ' Outil de conception et d''analyse des résonateur diélectriques',...
             '==============================================================='));
disp(sprintf('\n--------- Conception d''un résonateur rectangulaire ------------'));

% Entrée des paramètres :
freq = [];
while isempty(freq)||(isnumeric(freq) == 0)
   freq = input('\nEntrez la fréquence de résonance désirée (en GHz) : ');
end

choix_mode = [];
while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2 && choix_mode ~= 3)
    choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                        '   (1) Mode TE(x)d11\n', ...
                        '   (2) Mode TE(y)1d1\n', ...
                        '   (3) Mode TE(z)11d (pour un résonateur isolé)\n', ...
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
    er = input('\nEntrez la constante diélectrique du matériau disponible : ');
end

ratio = [];
while isempty(ratio)||(isnumeric(ratio) == 0)
    ratio = input('\nEntrez le ratio ''largeur/hauteur'' (w/h) désiré \nou ''0'' si vous ne voulez pas le spécifier : ');
end

% On ajuste la valeur du ratio à w/(2*h), pour tenir compte de l'effet du
% plan de masse (effet image) :
ratio = ratio/2;
    
ratio2 = [];
while isempty(ratio2)||(isnumeric(ratio2) == 0)
    ratio2 = input('\nEntrez le ratio ''profondeur/hauteur'' désiré (d/h)\nou ''0'' si vous ne voulez pas le spécifier : ');
end

% On ajuste la valeur de ratio2 à d/(2*h), pour tenir compte de l'effet du
% plan de masse (effet image) :
ratio2 = ratio2/2;

repeter = 1;
definir_plage_ratios = 1;
definir_plage_ratios2 = 1;

while (repeter == 1)
    % Détermination du facteur-Q maximal à partir du VSWR et de la bande passante spécifiée :
    facteurQ_max = (VSWR-1)/(sqrt(VSWR)*BW);
    facteurQ = [];
    % Détermination de k0 à partir de la fréquence visée
    k0 = 2*pi*freq*1e7/299792458;
    % Si les ratios sont spécifiés par l'utilisateur, il faut vérifier s'il est possible d'obtenir la bande
    % passante désirée pour le mode de rayonnement choisi :
    if (ratio ~= 0 && ratio2 ~= 0)
        switch choix_mode
            case 1
                for n = 0:0.0001:Inf
                    ky = pi*ratio2/ratio/n;
                    kz = pi*ratio2/n;
                    kx = sqrt(er*k0^2-ky^2-kz^2);
                    y = real(kx*tan(kx*n/2)-sqrt((er-1)*k0^2-kx^2));
                    if (y > 0) 
                        d = n;
                        break 
                    end
                end
                b = d/ratio2;
                h = b/2;
                w = b*ratio;
                ky = pi/w;
                kz = pi/b;
                kx = sqrt(er*k0^2-ky^2-kz^2);
                We = 8.854e-12*er*w*2*h*d/32*(1+sin(kx*d)/kx/d)*(ky^2+kz^2);
                pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kx*d/2);
                k0 = sqrt((kx^2+ky^2+kz^2)/er);
                Prad = 10*k0^4*norm(pm)^2;
                facteurQ = 4*pi*freq*1e7*We/Prad;
            case 2
                for n = 0:0.0001:Inf
                    kx = pi*ratio/ratio2/n;
                    kz = pi*ratio/n;
                    ky = sqrt(er*k0^2-kx^2-kz^2);
                    y = real(ky*tan(ky*n/2)-sqrt((er-1)*k0^2-ky^2));
                    if (y > 0) 
                        w = n;
                        break 
                    end
                end
                b = w/ratio;
                h = b/2;
                d = b*ratio2;
                kx = pi/d;
                kz = pi/b;
                ky = sqrt(er*k0^2-kx^2-kz^2);
                We = 8.854e-12*er*w*2*h*d/32*(1+sin(ky*w)/ky/w)*(kx^2+kz^2);
                pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(ky*w/2);
                k0 = sqrt((kx^2+ky^2+kz^2)/er);
                Prad = 10*k0^4*norm(pm)^2;
                facteurQ = 4*pi*freq*1e7*We/Prad;
            case 3
                for n = 0:0.0001:Inf
                    kx = pi/ratio2/n;
                    ky = pi/ratio/n;
                    kz = sqrt(er*k0^2-kx^2-ky^2);
                    y = real(kz*tan(kz*n/2)-sqrt((er-1)*k0^2-kz^2));
                    if (y > 0) 
                        b = n;
                        break 
                    end
                end
                h = b/2;
                d = ratio2*b;
                w = ratio*b;
                kx = pi/d;
                ky = pi/w;
                kz = sqrt(er*k0^2-kx^2-ky^2);
                We = 8.854e-12*er*w*2*h*d/32*(1+sin(kz*2*h)/kz/2/h)*(kx^2+ky^2);
                pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kz*h);
                k0 = sqrt((kx^2+ky^2+kz^2)/er);
                Prad = 10*k0^4*norm(pm)^2;
                facteurQ = 4*pi*freq*1e7*We/Prad;       
        end
        
        % Si ce n'est pas possible, il faut que l'utilisateur change certaines spécifications :
        if (facteurQ_max < facteurQ)
            clc
            choix = [];
            while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4 && choix ~= 5 && choix ~= 6)
                choix = input(['\nLa bande passante désirée ne peut être atteinte pour ce mode avec la\n',...
                               'combinaison de ratios et la constante diélectrique choisie. Désirez-vous :\n', ...
                               '   (1) Modifier le ratio ''largeur/hauteur'' (w/h) (ou ne pas en spécifier)?\n', ...
                               '   (2) Modifier le ratio ''profondeur/hauteur'' (d/h) (ou ne pas en spécifier)?\n', ...
                               '   (3) Modifier la constante diélectrique du résonateur?\n', ...
                               '   (4) Modifier la bande passante minimale?\n', ...
                               '   (5) Choisir un autre mode de rayonnement?\n', ...
                               '   (6) Retourner au menu principal?\n', ...                               
                               'Faites votre choix : ']);
            end

            switch choix
                case 1
                    ratio = [];
                    while isempty(ratio)||(isnumeric(ratio) == 0)
                        ratio = input('\nEntrez le nouveau ratio ''largeur/hauteur'' (w/h) désiré\nou ''0'' si vous ne voulez pas le spécifier : ');
                    end
                    if(ratio == 0)
                        definir_plage_ratios = 1;
                    end
                case 2
                    ratio2 = [];
                    while isempty(ratio2)||(isnumeric(ratio2) == 0)
                        ratio2 = input('\nEntrez le ratio ''profondeur/hauteur'' désiré\nou ''0'' si vous ne voulez pas le spécifier : ');
                    end
                    if(ratio2 == 0)
                        definir_plage_ratios2 = 1;
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
                    while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2 && choix_mode ~= 3)
                        choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                                            '   (1) Mode TE(x)d11\n', ...
                                            '   (2) Mode TE(y)1d1\n', ...
                                            '   (3) Mode TE(z)11d (pour un résonateur isolé)\n', ...
                                            'Faites votre choix : ']);
                    end
                case 6     
                    return
            end    
        
        % Lorsque tous les parametres sont corrects, on calcule la bande passante réelle :
        else
            BW_reelle = (VSWR-1)/(sqrt(VSWR)*facteurQ)*100;
            repeter = 0;
        end
             
    elseif(ratio ~= 0 && ratio2 == 0)
        
        if(definir_plage_ratios2 == 1)
        
            ratio2_min = [];
            while isempty(ratio2_min)||(isnumeric(ratio2_min) == 0)||(ratio2_min < 0)
                ratio2_min = input('\nEntrez le ratio ''profondeur/hauteur'' (d/h) minimal à étudier (>= 0) : ');
            end
            % Pour tenir compte de l'effet du plan de masse :
            ratio2_min = ratio2_min/2;
        
            ratio2_max = [];
            while isempty(ratio2_max)||(isnumeric(ratio2_max) == 0)||(ratio2_max <= ratio2_min)
                ratio2_max = input('\nEntrez le ratio ''profondeur/hauteur'' (d/h) maximal à étudier : ');
            end
            % Pour tenir compte de l'effet du plan de masse :
            ratio2_max = ratio2_max/2;
            
            nombre = [];
            while isempty(nombre)||(isnumeric(nombre) == 0)||(nombre < 2)
                nombre = input('\nEn incluant ces limites, entrez le nombre de ratios à étudier : ');
            end
        
            definir_plage_ratios2 = 0;
        
            % Le pas de calcul représente l'incrément du ratio pour chaque série de calculs 
            pas = (ratio2_max - ratio2_min)/(nombre-1);
            % Création d'une matrice pour le stockage des résultats valides
            resultats = [];
            % Indice de la ligne où entrer les résultats qui respectent les paramètres de conception 
            ligne = 1;
        end    
        
        for k = ratio2_min:pas:ratio2_max
            % Pour chaque valeur de k (de ratio d/(2*h)), on évalue le facteur-Q
            switch choix_mode
                case 1
                    for n = 0:0.0001:Inf
                        ky = pi*k/ratio/n;
                        kz = pi*k/n;
                        kx = sqrt(er*k0^2-ky^2-kz^2);
                        y = real(kx*tan(kx*n/2)-sqrt((er-1)*k0^2-kx^2));
                        if (y > 0) 
                            d = n;
                            break 
                        end
                    end
                    b = d/k;
                    h = b/2;
                    w = b*ratio;
                    ky = pi/w;
                    kz = pi/b;
                    kx = sqrt(er*k0^2-ky^2-kz^2);
                    We = 8.854e-12*er*w*2*h*d/32*(1+sin(kx*d)/kx/d)*(ky^2+kz^2);
                    pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kx*d/2);
                    k0 = sqrt((kx^2+ky^2+kz^2)/er);
                    Prad = 10*k0^4*norm(pm)^2;
                    facteurQ = 4*pi*freq*1e7*We/Prad;
                case 2
                    for n = 0:0.0001:Inf
                        kx = pi*ratio/k/n;
                        kz = pi*ratio/n;
                        ky = sqrt(er*k0^2-kx^2-kz^2);
                        y = real(ky*tan(ky*n/2)-sqrt((er-1)*k0^2-ky^2));
                        if (y > 0) 
                            w = n;
                            break 
                        end
                    end
                    b = w/ratio;
                    h = b/2;
                    d = b*k;
                    kx = pi/d;
                    kz = pi/b;
                    ky = sqrt(er*k0^2-kx^2-kz^2);
                    We = 8.854e-12*er*w*2*h*d/32*(1+sin(ky*w)/ky/w)*(kx^2+kz^2);
                    pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(ky*w/2);
                    k0 = sqrt((kx^2+ky^2+kz^2)/er);
                    Prad = 10*k0^4*norm(pm)^2;
                    facteurQ = 4*pi*freq*1e7*We/Prad;
                case 3
                    for n = 0:0.0001:Inf
                        kx = pi/k/n;
                        ky = pi/ratio/n;
                        kz = sqrt(er*k0^2-kx^2-ky^2);
                        y = real(kz*tan(kz*n/2)-sqrt((er-1)*k0^2-kz^2));
                        if (y > 0) 
                            b = n;
                            break 
                        end
                    end
                    h = b/2;
                    d = k*b;
                    w = ratio*b;
                    kx = pi/d;
                    ky = pi/w;
                    kz = sqrt(er*k0^2-kx^2-ky^2);
                    We = 8.854e-12*er*w*2*h*d/32*(1+sin(kz*2*h)/kz/2/h)*(kx^2+ky^2);
                    pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kz*h);
                    k0 = sqrt((kx^2+ky^2+kz^2)/er);
                    Prad = 10*k0^4*norm(pm)^2;
                    facteurQ = 4*pi*freq*1e7*We/Prad;       
            end
            
            % Si le facteur-Q calculé permet d'atteindre la bande passante 
            % minimale, on calcule sa bande passante réelle et on garde les résultats 
            if (facteurQ_max > facteurQ)
                BW_reelle = (VSWR-1)/(sqrt(VSWR)*facteurQ)*100;
                resultats(ligne,:) = [k*2 w d h facteurQ BW_reelle]; 
                ligne = ligne+1;
            end    
        end
        
        if(ligne == 1)
            clc
            choix = [];
            while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4 && choix ~= 5)
                choix = input(['\nLa bande passante minimale ne peut être atteinte pour ce mode pour la\n',...
                               'constante diélectrique et la plage de ratios choisies. Désirez-vous :\n', ...
                               '   (1) Modifier la plage de ratios ''profondeur/hauteur'' (d/h) (ou fixer un ratio unique)?\n', ...
                               '   (2) Modifier la constante diélectrique du résonateur?\n', ...
                               '   (3) Modifier la bande passante minimale?\n', ...
                               '   (4) Choisir un autre mode de rayonnement?\n', ...
                               '   (5) Retourner au menu principal?\n', ...
                               'Faites votre choix : ']);
            end
            
            switch choix
                case 1
                    ratio2 = [];
                    while isempty(ratio2)||(isnumeric(ratio2) == 0)
                        ratio2 = input('\nEntrez le nouveau ratio ''profondeur/hauteur'' (d/h) désiré\nou ''0'' si vous ne voulez pas le spécifier : ');
                    end
                    % Effet du plan de masse :
                    ratio2 = ratio2/2;
                    if(ratio2 == 0)
                        definir_plage_ratios2 = 1;
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
                    while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2 && choix_mode ~= 3)
                        choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                                            '   (1) Mode TE(x)d11\n', ...
                                            '   (2) Mode TE(y)1d1\n', ...
                                            '   (3) Mode TE(z)11d\n', ...
                                            'Faites votre choix : ']);
                    end
                case 5    
                    return
            end
            
        else
            repeter = 0;
        end

    elseif(ratio == 0 && ratio2 ~= 0)
        
        if(definir_plage_ratios == 1)
        
            ratio_min = [];
            while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min == 0)
                ratio_min = input('\nEntrez le ratio ''largeur/hauteur'' (w/h) minimal à étudier : ');
            end
            % Pour tenir compte de l'effet du plan de masse :
            ratio_min = ratio_min/2;
            
            ratio_max = [];
            while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)
                ratio_max = input('\nEntrez le ratio ''largeur/hauteur'' (w/h) maximal à étudier : ');
            end
            % Pour tenir compte de l'effet du plan de masse :
            ratio_max = ratio_max/2;
            
            nombre = [];
            while isempty(nombre)||(isnumeric(nombre) == 0)||(nombre < 2)
                nombre = input('\nEn incluant ces limites, entrez le nombre de ratios à étudier : ');
            end
        
            definir_plage_ratios = 0;
        
            % Le pas de calcul représente l'incrément du ratio pour chaque série de calculs
            pas = (ratio_max-ratio_min)/(nombre-1);
            % Création d'une matrice pour le stockage des résultats valides
            resultats = [];
            % Indice de la ligne où entrer les résultats qui respectent les paramètres de conception 
            ligne = 1;
        end    
        
        for k = ratio_min:pas:ratio_max
            % Pour chaque valeur de k (de ratio w/(2*h)), on évalue le facteur-Q
            switch choix_mode
                case 1
                    for n = 0:0.0001:Inf
                        ky = pi*ratio2/k/n;
                        kz = pi*ratio2/n;
                        kx = sqrt(er*k0^2-ky^2-kz^2);
                        y = real(kx*tan(kx*n/2)-sqrt((er-1)*k0^2-kx^2));
                        if (y > 0) 
                            d = n;
                            break 
                        end
                    end
                    b = d/ratio2;
                    h = b/2;
                    w = b*k;
                    ky = pi/w;
                    kz = pi/b;
                    kx = sqrt(er*k0^2-ky^2-kz^2);
                    We = 8.854e-12*er*w*2*h*d/32*(1+sin(kx*d)/kx/d)*(ky^2+kz^2);
                    pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kx*d/2);
                    k0 = sqrt((kx^2+ky^2+kz^2)/er);
                    Prad = 10*k0^4*norm(pm)^2;
                    facteurQ = 4*pi*freq*1e7*We/Prad;
                case 2
                    for n = 0:0.0001:Inf
                        kx = pi*k/ratio2/n;
                        kz = pi*k/n;
                        ky = sqrt(er*k0^2-kx^2-kz^2);
                        y = real(ky*tan(ky*n/2)-sqrt((er-1)*k0^2-ky^2));
                        if (y > 0) 
                            w = n;
                            break 
                        end
                    end
                    b = w/k;
                    h = b/2;
                    d = b*ratio2;
                    kx = pi/d;
                    kz = pi/b;
                    ky = sqrt(er*k0^2-kx^2-kz^2);
                    We = 8.854e-12*er*w*2*h*d/32*(1+sin(ky*w)/ky/w)*(kx^2+kz^2);
                    pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(ky*w/2);
                    k0 = sqrt((kx^2+ky^2+kz^2)/er);
                    Prad = 10*k0^4*norm(pm)^2;
                    facteurQ = 4*pi*freq*1e7*We/Prad;
                case 3
                    for n = 0:0.0001:Inf
                        kx = pi/ratio2/n;
                        ky = pi/k/n;
                        kz = sqrt(er*k0^2-kx^2-ky^2);
                        y = real(kz*tan(kz*n/2)-sqrt((er-1)*k0^2-kz^2));
                        if (y > 0) 
                            b = n;
                            break 
                        end
                    end
                    h = b/2;
                    d = ratio2*b;
                    w = k*b;
                    kx = pi/d;
                    ky = pi/w;
                    kz = sqrt(er*k0^2-kx^2-ky^2);
                    We = 8.854e-12*er*w*2*h*d/32*(1+sin(kz*2*h)/kz/2/h)*(kx^2+ky^2);
                    pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kz*h);
                    k0 = sqrt((kx^2+ky^2+kz^2)/er);
                    Prad = 10*k0^4*norm(pm)^2;
                    facteurQ = 4*pi*freq*1e7*We/Prad;       
            end
            
            % Si le facteur-Q calculé permet d'atteindre la bande passante minimale, on calcule les 
            % dimensions du résonateur, sa bande passante réelle et on garde les résultats
            if (facteurQ_max > facteurQ)
                BW_reelle = (VSWR-1)/(sqrt(VSWR)*facteurQ)*100;
                resultats(ligne,:) = [k*2 w d h facteurQ BW_reelle]; 
                ligne = ligne+1;
            end    
        end
        
        if(ligne == 1)
            clc
            choix = [];
            while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4 && choix ~= 5)
                choix = input(['\nLa bande passante minimale ne peut être atteinte pour ce mode pour la\n',...
                               'constante diélectrique et la plage de ratios choisies. Désirez-vous :\n', ...
                               '   (1) Modifier la plage de ratios ''largeur/hauteur'' (w/h) (ou fixer un ratio unique)?\n', ...
                               '   (2) Modifier la constante diélectrique du résonateur?\n', ...
                               '   (3) Modifier la bande passante minimale?\n', ...
                               '   (4) Choisir un autre mode de rayonnement?\n', ...
                               '   (5) Retourner au menu principal?\n', ...
                               'Faites votre choix : ']);
            end
            
            switch choix
                case 1
                    ratio = [];
                    while isempty(ratio)||(isnumeric(ratio) == 0)
                        ratio = input('\nEntrez le nouveau ratio ''largeur/hauteur'' (w/h) désiré\nou ''0'' si vous ne voulez pas le spécifier : ');
                    end
                    % Effet du plan de masse :
                    ratio = ratio/2;
                    if(ratio == 0)
                        definir_plage_ratios = 1;
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
                    while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2 && choix_mode ~= 3)
                        choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                                            '   (1) Mode TE(x)d11\n', ...
                                            '   (2) Mode TE(y)1d1\n', ...
                                            '   (3) Mode TE(z)11d\n', ...
                                            'Faites votre choix : ']);
                    end
                case 5    
                    return
            end
            
        else
            repeter = 0;
        end
        
    else
        if(definir_plage_ratios == 1)

            ratio_min = [];
            while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min <= 0)
                ratio_min = input('\nEntrez le ratio ''largeur/hauteur'' (w/h) minimal à étudier : ');
            end
            % Pour tenir compte de l'effet du plan de masse :
            ratio_min = ratio_min/2;
        
            ratio_max = [];
            while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)
                ratio_max = input('\nEntrez le ratio ''largeur/hauteur'' (w/h) maximal à étudier : ');
            end
            % Pour tenir compte de l'effet du plan de masse :
            ratio_max = ratio_max/2;
                    
            nombre = [];
            while isempty(nombre)||(isnumeric(nombre) == 0)||(nombre < 2)
                nombre = input('\nEn incluant ces limites, entrez le nombre de ratios à étudier : ');
            end
        
            definir_plage_ratios = 0;
        
            % Le pas de calcul représente l'incrément du ratio pour chaque série de calculs
            pas = (ratio_max-ratio_min)/(nombre-1);
            % Création d'une matrice pour le stockage des résultats valides
            resultats = [];
            % Indice de la ligne où entrer les résultats qui respectent les paramètres de conception 
            ligne = 1;
        end
        
        if(definir_plage_ratios2 == 1)

            ratio2_min = [];
            while isempty(ratio2_min)||(isnumeric(ratio2_min) == 0)||(ratio2_min <= 0)
                ratio2_min = input('\nEntrez le ratio ''profondeur/hauteur'' (d/h) minimal à étudier : ');
            end
            % Pour tenir compte de l'effet du plan de masse :
            ratio2_min = ratio2_min/2;
        
            ratio2_max = [];
            while isempty(ratio2_max)||(isnumeric(ratio2_max) == 0)||(ratio2_max <= ratio2_min)
                ratio2_max = input('\nEntrez le ratio ''profondeur/hauteur'' (d/h) maximal à étudier : ');
            end
            % Pour tenir compte de l'effet du plan de masse :
            ratio2_max = ratio2_max/2;
            
            nombre2 = [];
            while isempty(nombre2)||(isnumeric(nombre2) == 0)||(nombre2 < 2)
                nombre2 = input('\nEn incluant ces limites, entrez le nombre de ratios à étudier : ');
            end
        
            definir_plage_ratios2 = 0;
        
            % Le pas de calcul représente l'incrément du ratio pour chaque série de calculs
            pas2 = (ratio2_max - ratio2_min)/(nombre2-1);
            % Création d'une matrice pour le stockage des résultats valides
            resultats = [];
            % Indice de la ligne où entrer les résultats qui respectent les paramètres de conception 
            ligne = 1;
        end
        
        for k = ratio_min:pas:ratio_max
            for l = ratio2_min:pas2:ratio2_max 
                % Pour chaque valeur de k et l (de ratio w/(2*h) et de ratio d/(2*h)), on évalue le facteur-Q
                switch choix_mode
                    case 1
                        for n = 0:0.0001:Inf
                            ky = pi*l/k/n;
                            kz = pi*l/n;
                            kx = sqrt(er*k0^2-ky^2-kz^2);
                            y = real(kx*tan(kx*n/2)-sqrt((er-1)*k0^2-kx^2));
                            if (y > 0) 
                                d = n;
                                break 
                            end
                        end
                        b = d/l;
                        h = b/2;
                        w = b*k;
                        ky = pi/w;
                        kz = pi/b;
                        kx = sqrt(er*k0^2-ky^2-kz^2);
                        We = 8.854e-12*er*w*2*h*d/32*(1+sin(kx*d)/kx/d)*(ky^2+kz^2);
                        pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kx*d/2);
                        k0 = sqrt((kx^2+ky^2+kz^2)/er);
                        Prad = 10*k0^4*norm(pm)^2;
                        facteurQ = 4*pi*freq*1e7*We/Prad;
                    case 2
                        for n = 0:0.0001:Inf
                            kx = pi*k/l/n;
                            kz = pi*k/n;
                            ky = sqrt(er*k0^2-kx^2-kz^2);
                            y = real(ky*tan(ky*n/2)-sqrt((er-1)*k0^2-ky^2));
                            if (y > 0) 
                                w = n;
                                break 
                            end
                        end
                        b = w/k;
                        h = b/2;
                        d = b*l;
                        kx = pi/d;
                        kz = pi/b;
                        ky = sqrt(er*k0^2-kx^2-kz^2);
                        We = 8.854e-12*er*w*2*h*d/32*(1+sin(ky*w)/ky/w)*(kx^2+kz^2);
                        pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(ky*w/2);
                        k0 = sqrt((kx^2+ky^2+kz^2)/er);
                        Prad = 10*k0^4*norm(pm)^2;
                        facteurQ = 4*pi*freq*1e7*We/Prad;
                    case 3
                        for n = 0:0.0001:Inf
                            kx = pi/l/n;
                            ky = pi/k/n;
                            kz = sqrt(er*k0^2-kx^2-ky^2);
                            y = real(kz*tan(kz*n/2)-sqrt((er-1)*k0^2-kz^2));
                            if (y > 0) 
                                b = n;
                                break 
                            end
                        end
                        h = b/2;
                        d = l*b;
                        w = k*b;
                        kx = pi/d;
                        ky = pi/w;
                        kz = sqrt(er*k0^2-kx^2-ky^2);
                        We = 8.854e-12*er*w*2*h*d/32*(1+sin(kz*2*h)/kz/2/h)*(kx^2+ky^2);
                        pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kz*h);
                        k0 = sqrt((kx^2+ky^2+kz^2)/er);
                        Prad = 10*k0^4*norm(pm)^2;
                        facteurQ = 4*pi*freq*1e7*We/Prad;       
                end
            
                % Si le facteur-Q calculé permet d'atteindre la bande passante minimale, 
                % on calcule la bande passante réelle et on garde les résultats
                if (facteurQ_max > facteurQ)
                    BW_reelle = (VSWR-1)/(sqrt(VSWR)*facteurQ)*100;
                    resultats(ligne,:) = [k*2 l*2 w d h facteurQ BW_reelle]; 
                    ligne = ligne+1;
                end    
            end
        end
        
        if(ligne == 1)
            clc
            choix = [];
            while isempty(choix)||(choix ~= 1 && choix ~= 2 && choix ~= 3 && choix ~= 4 && choix ~= 5 && choix ~= 6)
                choix = input(['\nLa bande passante minimale ne peut être atteinte pour ce mode pour la\n',...
                               'constante diélectrique et les plages de ratios choisies. Désirez-vous :\n', ...
                               '   (1) Modifier la plage de ratios ''largeur/hauteur'' (w/h) (ou fixer un ratio unique)?\n', ...
                               '   (2) Modifier la plage de ratios ''profondeur/hauteur'' (d/h) (ou fixer un ratio unique)?\n', ...
                               '   (3) Modifier la constante diélectrique du résonateur?\n', ...
                               '   (4) Modifier la bande passante minimale?\n', ...
                               '   (5) Choisir un autre mode de rayonnement?\n', ...
                               '   (6) Retourner au menu principal?\n', ...
                               'Faites votre choix : ']);
            end
            
            switch choix
                case 1
                    ratio = [];
                    while isempty(ratio)||(isnumeric(ratio) == 0)
                        ratio = input('\nEntrez le nouveau ratio ''largeur/hauteur'' (w/h) désiré\nou ''0'' si vous ne voulez pas le spécifier : ');
                    end
                    % Effet du plan de masse :
                    ratio = ratio/2;
                    if(ratio == 0)
                        definir_plage_ratios = 1;
                    end
                case 2
                    ratio2 = [];
                    while isempty(ratio2)||(isnumeric(ratio2) == 0)
                        ratio2 = input('\nEntrez le nouveau ratio ''profondeur/hauteur'' (d/h) désiré\nou ''0'' si vous ne voulez pas le spécifier : ');
                    end
                    % Effet du plan de masse :
                    ratio2 = ratio2/2;
                    if(ratio2 == 0)
                        definir_plage_ratios2 = 1;
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
                    while isempty(choix_mode)||(choix_mode ~= 1 && choix_mode ~= 2 && choix_mode ~= 3)
                        choix_mode = input(['\nPour quel mode de rayonnement?\n',...
                                            '   (1) Mode TE(x)d11\n', ...
                                            '   (2) Mode TE(y)1d1\n', ...
                                            '   (3) Mode TE(z)11d\n', ...
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
        disp(sprintf('\n--------- Conception d''un résonateur rectangulaire ------------\n'));
 
        % Affichage des paramètres d'entrée :
        disp(sprintf('Fréquence de résonance (en GHz) = %5.4f',freq));
        switch choix_mode
            case 1
                disp(sprintf('Mode de rayonnement = TE(x)d11'));
            case 2
                disp(sprintf('Mode de rayonnement = TE(y)1d1'));
            case 3
                disp(sprintf('Mode de rayonnement = TE(z)11d'));
        end
        disp(sprintf('Bande passante fractionnelle minimale = %5.4f',BW));
        disp(sprintf('VSWR pour le calcul de la bande passante = %5.4f',VSWR));
        disp(sprintf('Constante diélectrique du résonateur = %5.4f',er));
    
        % Affichage des résultats :
        if (ratio ~= 0 && ratio2 ~= 0)
            disp(sprintf('Ratio ''largeur/hauteur'' (w/h) = %5.4f',ratio*2));
            disp(sprintf('Ratio ''profondeur/hauteur'' (d/h) = %5.4f',ratio2*2));
           
            disp(sprintf('\n'));
            disp(strvcat('       Résultats pour le mode choisi', ...
                         '--------------------------------------------'));
            disp(sprintf('Largeur (w) du résonateur (en cm) = %5.4f',w));
            disp(sprintf('Profondeur (d) du résonateur (en cm) = %5.4f',d));
            disp(sprintf('Hauteur (h) du résonateur (en cm) = %5.4f',h));
            disp(sprintf('Facteur-Q = %5.4f',facteurQ));
            disp(sprintf('Bande passante (en pourcentage) = %5.4f',BW_reelle));
            
        elseif (ratio ~= 0 && ratio2 == 0)
            disp(sprintf('\n'));
            disp(sprintf('Ratio ''largeur/hauteur'' (w/h) = %5.4f',ratio*2));
            disp(sprintf('Ratio ''profondeur/hauteur'' (d/h) minimal = %5.4f',ratio2_min*2));
            disp(sprintf('Ratio ''profondeur/hauteur'' (d/h) maximal = %5.4f',ratio2_max*2));
            disp(sprintf('Nombre de ratios à étudier = %5.4f',nombre));
            
            disp(sprintf('\n'));
            disp(strvcat('                    Résultats pour le mode choisi', ...                 
                         '--------------------------------------------------------------------'));
            disp('d/h         w           d           h           facteurQ    BW');
            disp('--------------------------------------------------------------------');
            for n = 1:1:size(resultats,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',resultats(n,:)));
            end
        elseif (ratio == 0 && ratio2 ~= 0)
            disp(sprintf('\n'));
            disp(sprintf('Ratio ''profondeur/hauteur'' (d/h) = %5.4f',ratio2*2));
            disp(sprintf('Ratio ''largeur/hauteur'' (w/h) minimal = %5.4f',ratio_min*2));
            disp(sprintf('Ratio ''largeur/hauteur'' (w/h) maximal = %5.4f',ratio_max*2));
            disp(sprintf('Nombre de ratios à étudier = %5.4f',nombre));
            
            disp(sprintf('\n'));
            disp(strvcat('                    Résultats pour le mode choisi', ...     
                         '--------------------------------------------------------------------'));
            disp('w/h         w           d           h           facteurQ    BW');
            disp('--------------------------------------------------------------------');
            for n = 1:1:size(resultats,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',resultats(n,:)));
            end
        else
            disp(sprintf('\n'));
            disp(sprintf('Ratio ''largeur/hauteur'' (w/h) minimal = %5.4f',ratio_min*2));
            disp(sprintf('Ratio ''largeur/hauteur'' (w/h) maximal = %5.4f',ratio_max*2));
            disp(sprintf('Nombre de ratios à étudier = %5.4f',nombre));
            disp(sprintf('\n'));
            disp(sprintf('Ratio ''profondeur/hauteur'' (d/h) minimal = %5.4f',ratio2_min*2));
            disp(sprintf('Ratio ''profondeur/hauteur'' (d/h) maximal = %5.4f',ratio2_max*2));
            disp(sprintf('Nombre de ratios à étudier = %5.4f',nombre2));
            
            disp(sprintf('\n'));
            disp(strvcat('                        Résultats pour le mode choisi', ...            
                         '--------------------------------------------------------------------------------'));
            disp('w/h         d/h         w           d           h           facteurQ    BW');
            disp('--------------------------------------------------------------------------------');
            for n = 1:1:size(resultats,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',resultats(n,:)));
            end    
        end
    end
end

end