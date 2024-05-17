%--------------------------------------------------------------------------
%                               dRing_en.m                                   
%--------------------------------------------------------------------------
%  Dielectric ring resonator design (english)                                              
%
%    A) INPUTS
%
%    1. 'freq' = Desired resonant frequency                        
%    2. 'mode_choice' = Desired mode of radiation             
%    3. 'BW' = Desired minimum impedance bandwidth         
%    4. 'VSWR' = Tolerable Voltage standing wave ratio for the calculations    
%    5. 'er' = Dielectric constant of the available material
%    6. 'ratio' = 'Height/outer radius' ratio of the resonator (facult.)
%    7. 'ratio2' = 'Inner radius/outer radius' ratio of the resonator (fac.)
%
%    B) OUTPUTS
%
%    - The dimensions (inner radius, outer radius, and height) of the 
%      resonator for which the minimum bandwidth is respected at the 
%      resonant frequency. If the 'height/outer radius' and/or 
%      'inner radius/outer radius' ratio(s) is (are) not specified by the 
%      user, a list of all the possible dimensions respecting the design 
%      criterions will be generated (over user-defined span(s) of ratios).
%--------------------------------------------------------------------------
%  References:
%
%  - M. Verplanken and J. Van Bladel, "The electric dipole resonances of
%    ring resonators of very high permittivity," IEEE Transactions on 
%    microwave theory and techniques, Vol. 24, No. 2, February 1976, pp. 
%    108-112.
%  - M. Verplanken and J. Van Bladel, "The magnetic dipole resonances of
%    ring resonators of very high permittivity," IEEE Transactions on 
%    microwave theory and techniques, Vol. 27, No. 4, April 1979, pp. 328-
%    332.
%--------------------------------------------------------------------------
%  Note: This file is a part of the "Dielectric resonator design and 
%        analysis utility" (DRA.m).
%
%  Programming: Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation: Institut national de la recherche scientifique (INRS)  
%  Last modification: July 31st, 2008                              
%--------------------------------------------------------------------------

function dRing_en

% Header:
clc
disp(strvcat('===============================================================',...
             '       Dielectric resonator design and analysis utility        ',...
             '==============================================================='));
disp(sprintf('\n------------------- Ring resonator design ---------------------'));

% Input of the parameters:
freq = [];
while isempty(freq)||(isnumeric(freq) == 0)
   freq = input('\nInput the desired resonant frequency (GHz): ');
end

mode_choice = [];
while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2)
    mode_choice = input(['\nFor which mode?\n',...
                        '   (1) TE01d mode\n', ...
                        '   (2) TM01d mode\n', ...
                        'Make your choice: ']);
end

BW = [];
while isempty(BW)||(isnumeric(BW) == 0)
   BW = input('\nInput the minimum fractional bandwidth (e.g.: 0.05 for 5%): ');
end

VSWR = [];
while isempty(VSWR)||(isnumeric(VSWR) == 0)
    VSWR = input('\nInput the VSWR for the impedance bandwidth calculations (e.g.: 2): ');
end

er = [];
while isempty(er)||(isnumeric(er) == 0)
    er = input('\nInput the dielectric constant of the available material: ');
end

ratio = [];
if (mode_choice == 1)
    while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 3)
        ratio = input('\nInput the desired ''height/outer radius'' (h/a) ratio (0.1 <= ratio <= 3) \nor ''0'' if you do not want to specify it: ');
    end
else
    while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 1.3)
        ratio = input('\nInput the desired ''height/outer radius'' (h/a) ratio (0.1 <= ratio <= 1.3) \nor ''0'' if you do not want to specify it: ');
    end
end
    
ratio2 = [];
while isempty(ratio2)||(isnumeric(ratio2) == 0)||(ratio2 < 0)||(ratio2 > 0.75)
    ratio2 = input('\nInput the desired ''inner radius/outer radius'' (b/a) ratio (0 < ratio <= 0.75) \nor ''0'' if you do not want to specify it: ');
end

repeat = 1;
define_ratio_span = 1;
define_ratio2_span = 1;
while (repeat == 1)
    % Maximum Q-factor for the minimum bandwidth and VSWR:
    maxQfactor = (VSWR-1)/(sqrt(VSWR)*BW);
    Qfactor = [];
    % If the ratios are not specified, we must verify that the
    % minimum bandwidth can be achieved for the desired mode:
    if (ratio ~= 0 && ratio2 ~= 0)
        if (mode_choice == 1)
            Qfactor = polyval(coeffQTE(ratio2),ratio)*er^1.5;
        else 
            Qfactor = polyval(coeffQTM(ratio2),ratio)*er^2.5;
        end
        % If it is not possible, the user must change at least one design parameter:
        if (maxQfactor < Qfactor)
            clc
            choice = [];
            while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3 && choice ~= 4 && choice ~= 5 && choice ~= 6)
                choice = input(['\nThe desired bandwidth cannot be achieved for this mode with the\n',...
                               'specified dielectric constant and ratios. Do you wish to:\n', ...
                               '   (1) Modify the ''height/outer radius'' (h/a) ratio (or omit specifying one)?\n', ...
                               '   (2) Modify the ''inner radius/outer radius'' (b/a) ratio (or omit specifying one)?\n', ...
                               '   (3) Modify the dielectric constant of the resonator?\n', ...
                               '   (4) Modify the minimum impedance bandwidth?\n', ...
                               '   (5) Select another mode?\n', ...
                               '   (6) Return to the main menu?\n', ...                               
                               'Make your choice: ']);
            end

            switch choice
                case 1
                    ratio = [];
                    if (mode_choice == 1)
                        while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 3)
                            ratio = input('\nInput the new ''height/outer radius'' (h/a) ratio (0.1 <= ratio <= 3) \nor ''0'' if you do not want to specify it: ');
                        end
                    else
                        while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 1.3)
                            ratio = input('\nInput the new ''height/outer radius'' (h/a) ratio (0.1 <= ratio <= 1.3) \nor ''0'' if you do not want to specify it: ');
                        end
                    end    
                    if(ratio == 0)
                        define_ratio_span = 1;
                    end
                case 2
                    ratio2 = [];
                    while isempty(ratio2)||(isnumeric(ratio2) == 0)||(ratio2 < 0)||(ratio2 > 0.75)
                        ratio2 = input('\nInput the new ''inner radius/outer radius'' (b/a) ratio (0 < ratio <= 0.75) \nor ''0'' if you do not want to specify it: ');
                    end
                    if(ratio2 == 0)
                        define_ratio2_span = 1;
                    end
                case 3
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nInput the new dielectric constant of the resonator: ');
                    end
                case 4
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nInput the new minimum fractional bandwidth (e.g.: 0.05 for 5%): ');
                    end
                case 5 
                    mode_choice = [];
                    while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2)
                        mode_choice = input(['\nFor which mode?\n',...
                                            '   (1) TE01d mode\n', ...
                                            '   (2) TM01d mode\n', ...
                                            'Make your choice: ']);
                    end
                case 6     
                    return
            end    
        
        % If all parameters are correct, the dimensions of the resonator are calculated:
        else
            if (mode_choice == 1)
                a = 4.7713*polyval(coeffTE(ratio2),ratio)/sqrt(er)/freq;
            else
                a = 299792458*sqrt(pi^2/4/ratio^2+calcX0(ratio2)^2)/(2*pi*sqrt(er)*freq)/1e7;
            end
            h = ratio*a;
            b = ratio2*a;
            actualBW = (VSWR-1)/(sqrt(VSWR)*Qfactor)*100;
            repeat = 0;
        end
             
    elseif(ratio ~= 0 && ratio2 == 0)
        if(define_ratio2_span == 1)
            ratio2_min = [];
            while isempty(ratio2_min)||(isnumeric(ratio2_min) == 0)||(ratio2_min < 0)||(ratio2_min >= 0.75)
                ratio2_min = input('\nInput the minimum ''inner radius/outer radius'' (b/a) ratio to study (0 < ratio < 0.75): ');
            end
        
            ratio2_max = [];
            while isempty(ratio2_max)||(isnumeric(ratio2_max) == 0)||(ratio2_max <= ratio2_min)||(ratio2_max > 0.75)
                ratio2_max = input('\nInput the maximum ''inner radius/outer radius'' (b/a) ratio to study (<= 0.75): ');
            end
        
            number = [];
            while isempty(number)||(isnumeric(number) == 0)||(number < 2)
                number = input('\nIncluding these limits, input the number of ratios to study: ');
            end
        
            define_ratio2_span = 0;
            step = (ratio2_max - ratio2_min)/(number-1);
            results = [];
            row = 1;
        end    
        
        % For each value of n (of ratio b/a), the Q-factor is calculated:
        for n = ratio2_min:step:ratio2_max
            if (mode_choice == 1)
                Qfactor = polyval(coeffQTE(n),ratio)*er^1.5;
            else    
                Qfactor = polyval(coeffQTM(n),ratio)*er^2.5;
            end
            
            % If the calculated Q-factor meets the minimum specifications, the dimensions
            % of the resonator and actual bandwidth are calculated and stored.
            if (maxQfactor > Qfactor)
                if (mode_choice == 1)
                    a = 4.7713*polyval(coeffTE(n),ratio)/sqrt(er)/freq;
                else 
                    a = 299792458*sqrt(pi^2/4/ratio^2+calcX0(n)^2)/(2*pi*sqrt(er)*freq)/1e7;
                end
                h = ratio*a;
                b = n*a;
                actualBW = (VSWR-1)/(sqrt(VSWR)*Qfactor)*100;
                results(row,:) = [n a b h Qfactor actualBW]; 
                row = row+1;
            end    
        end
 
        % If the minimum bandwidth cannot be achieved for any value of 'n',
        % the user must change at least one design parameter:
        if(row == 1)
            clc
            choice = [];
            while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3 && choice ~= 4 && choice ~= 5)
                choice = input(['\nThe desired bandwidth cannot be achieved for this mode with the\n',...
                               'current ''dielectric constant/ratio limits'' combination. Do you wish to:\n', ...
                               '   (1) Modify the ''inner radius/outer radius'' (b/a) ratio limits (or specify a single ratio)?\n', ...
                               '   (2) Modify the dielectric constant of the resonator?\n', ...
                               '   (3) Modify the minimum impedance bandwidth?\n', ...
                               '   (4) Select another mode?\n', ...
                               '   (5) Return to the main menu?\n', ...                               
                               'Make your choice: ']);
            end
            
            switch choice
                case 1
                    ratio2 = [];
                    while isempty(ratio2)||(isnumeric(ratio2) == 0)||(ratio2 < 0)||(ratio2 > 0.75)
                        ratio2 = input('\nInput the new ''inner radius/outer radius'' (b/a) ratio (0 < ratio <= 0.75) \nor ''0'' if you do not want to specify it: ');
                    end
                    if(ratio2 == 0)
                        define_ratio2_span = 1;
                    end    
                case 2
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nInput the new dielectric constant of the resonator: ');
                    end
                case 3
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nInput the new minimum fractional bandwidth (e.g.: 0.05 for 5%): ');
                    end
                case 4
                    mode_choice = [];
                    while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2)
                        mode_choice = input(['\nFor which mode?\n',...
                                            '   (1) TE01d mode\n', ...
                                            '   (2) TM01d mode\n', ...
                                            'Make your choice: ']);
                    end
                case 5    
                    return
            end
            
        else
            repeat = 0;
        end

    elseif(ratio == 0 && ratio2 ~= 0)
        
        if(define_ratio_span == 1)
        
            ratio_min = [];
            ratio_max = [];
            
            if (mode_choice == 1)
                while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min < 0.1)||(ratio_min >= 3)
                    ratio_min = input('\nInput the minimum ''height/outer radius'' (h/a) ratio to study (0.1 <= ratio < 3): ');
                end
                while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)||(ratio_max > 3)
                    ratio_max = input('\nInput the maximum ''height/outer radius'' (h/a) ratio to study (<= 3): ');
                end
            else
                while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min < 0.1)||(ratio_min >= 1.3)
                    ratio_min = input('\nInput the minimum ''height/outer radius'' (h/a) ratio to study (0.1 <= ratio < 1.3): ');
                end
                while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)||(ratio_max > 1.3)
                    ratio_max = input('\nInput the maximum ''height/outer radius'' (h/a) ratio to study (<= 1.3): ');
                end
            end    
        
            number = [];
            while isempty(number)||(isnumeric(number) == 0)||(number < 2)
                number = input('\nIncluding these limits, input the number of ratios to study: ');
            end
        
            define_ratio_span = 0;
            step = (ratio_max - ratio_min)/(number-1);
            results = [];
            row = 1;
        end    
        
        % For each value of n (of ratio h/a), the Q-factor is calculated:
        for n = ratio_min:step:ratio_max
            if (mode_choice == 1)
                Qfactor = polyval(coeffQTE(ratio2),n)*er^1.5;
            else    
                Qfactor = polyval(coeffQTM(ratio2),n)*er^2.5;
            end
            
            % If the calculated Q-factor meets the minimum specifications, the dimensions
            % of the resonator and actual bandwidth are calculated and stored:
            if (maxQfactor > Qfactor)
                if (mode_choice == 1)
                    a = 4.7713*polyval(coeffTE(ratio2),n)/sqrt(er)/freq;
                else 
                    a = 299792458*sqrt(pi^2/4/n^2+calcX0(ratio2)^2)/(2*pi*sqrt(er)*freq)/1e7;
                end
                h = n*a;
                b = ratio2*a;
                actualBW = (VSWR-1)/(sqrt(VSWR)*Qfactor)*100;
                results(row,:) = [n a b h Qfactor actualBW]; 
                row = row+1;
            end    
        end

        % If the minimum bandwidth cannot be achieved for any value of 'n',
        % the user must change at least one design parameter:
        if(row == 1)
            clc
            choice = [];
            while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3 && choice ~= 4 && choice ~= 5)
                choice = input(['\nThe desired bandwidth cannot be achieved for this mode with the\n',...
                               'current ''dielectric constant/ratio limits'' combination. Do you wish to:\n', ...
                               '   (1) Modify the ''height/outer radius'' (h/a) ratio limits (or specify a single ratio)?\n', ...
                               '   (2) Modify the dielectric constant of the resonator?\n', ...
                               '   (3) Modify the minimum impedance bandwidth?\n', ...
                               '   (4) Select another mode?\n', ...
                               '   (5) Return to the main menu?\n', ...                               
                               'Make your choice: ']);
            end
            switch choice
                case 1
                    ratio = [];
                    if (mode_choice == 1)
                        while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 3)
                            ratio = input('\nInput the new ''height/outer radius'' (h/a) ratio (0.1 <= ratio <= 3) \nor ''0'' if you do not want to specify it: ');
                        end
                    else
                        while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 1.3)
                            ratio = input('\nInput the new ''height/outer radius'' (h/a) ratio (0.1 <= ratio <= 1.3) \nor ''0'' if you do not want to specify it: ');
                        end
                    end
                    if(ratio == 0)
                        define_ratio_span = 1;
                    end    
                case 2
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nInput the new dielectric constant of the resonator: ');
                    end
                case 3
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nInput the new minimum fractional bandwidth (e.g.: 0.05 for 5%): ');
                    end
                case 4
                    mode_choice = [];
                    while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2)
                        mode_choice = input(['\nFor which mode?\n',...
                                            '   (1) TE01d mode\n', ...
                                            '   (2) TM01d mode\n', ...
                                            'Make your choice: ']);
                    end
                case 5    
                    return
            end
            
        else
            repeat = 0;
        end
        
    else
        if(define_ratio_span == 1)

            ratio_min = [];
            ratio_max = [];
           
            if (mode_choice == 1)
                while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min < 0.1)||(ratio_min >= 3)
                    ratio_min = input('\nInput the minimum ''height/outer radius'' (h/a) ratio to study (0.1 <= ratio < 3): ');
                end
                while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)||(ratio_max > 3)
                    ratio_max = input('\nInput the maximum ''height/outer radius'' (h/a) ratio to study (<= 3): ');
                end
            else
                while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min < 0.1)||(ratio_min >= 1.3)
                    ratio_min = input('\nInput the minimum ''height/outer radius'' (h/a) ratio to study (0.1 <= ratio < 1.3): ');
                end
                while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)||(ratio_max > 1.3)
                    ratio_max = input('\nInput the maximum ''height/outer radius'' (h/a) ratio to study (<= 1.3): ');
                end
            end    
        
            number = [];
            while isempty(number)||(isnumeric(number) == 0)||(number < 2)
                number = input('\nIncluding these limits, input the number of ratios to study: ');
            end
        
            define_ratio_span = 0;
            step = (ratio_max - ratio_min)/(number-1);
            results = [];
            row = 1;
        end
        
        if(define_ratio2_span == 1)

            ratio2_min = [];
            while isempty(ratio2_min)||(isnumeric(ratio2_min) == 0)||(ratio2_min < 0)||(ratio2_min >= 0.75)
                ratio2_min = input('\nInput the minimum ''inner radius/outer radius'' (b/a) ratio to study (0 < ratio < 0.75): ');
            end
        
            ratio2_max = [];
            while isempty(ratio2_max)||(isnumeric(ratio2_max) == 0)||(ratio2_max <= ratio2_min)||(ratio2_max > 0.75)
                ratio2_max = input('\nInput the maximum ''inner radius/outer radius'' (b/a) ratio to study (<= 0.75): ');
            end
        
            number2 = [];
            while isempty(number2)||(isnumeric(number2) == 0)||(number2 < 2)
                number2 = input('\nIncluding these limits, input the number of ratios to study: ');
            end
        
            define_ratio2_span = 0;
            step2 = (ratio2_max - ratio2_min)/(number2-1);
            results = [];
            row = 1;
        end
        
        % For each combination of n and m (of ratios h/a and b/a) the Q-factor is calculated:
        for n = ratio_min:step:ratio_max
            for m = ratio2_min:step2:ratio2_max 
                if (mode_choice == 1)
                    Qfactor = polyval(coeffQTE(m),n)*er^1.5;
                else    
                    Qfactor = polyval(coeffQTM(m),n)*er^2.5;
                end
            
                % If the calculated Q-factor meets the minimum specifications, the dimensions
                % of the resonator and actual bandwidth are calculated and stored:
                if (maxQfactor > Qfactor)
                    if (mode_choice == 1)
                        a = 4.7713*polyval(coeffTE(m),n)/sqrt(er)/freq;
                    else 
                        a = 299792458*sqrt(pi^2/4/n^2+calcX0(m)^2)/(2*pi*sqrt(er)*freq)/1e7;
                    end
                    h = n*a;
                    b = m*a;
                    actualBW = (VSWR-1)/(sqrt(VSWR)*Qfactor)*100;
                    results(row,:) = [n m a b h Qfactor actualBW]; 
                    row = row+1;
                end    
            end
        end
        
        % If the minimum bandwidth cannot be achieved for any combination of 'n' and 'm',
        % the user must change at least one design parameter:        
        if(row == 1)
            clc
            choice = [];
            while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3 && choice ~= 4 && choice ~= 5 && choice ~= 6)
                choice = input(['\nThe desired bandwidth cannot be achieved for this mode with the\n',...
                                'current ''dielectric constant/ratio limits'' combination. Do you wish to:\n', ...
                                '   (1) Modify the ''height/outer radius'' (h/a) ratio limits (or specify a single ratio)?\n', ...
                                '   (2) Modify the ''inner radius/outer radius'' (b/a) ratio limits (or specify a single ratio)?\n', ...
                                '   (3) Modify the dielectric constant of the resonator?\n', ...
                                '   (4) Modify the minimum impedance bandwidth?\n', ...
                                '   (5) Select another mode?\n', ...
                                '   (6) Return to the main menu?\n', ...                               
                                'Make your choice: ']);
            end
            
            switch choice
                case 1
                    ratio = [];
                    if (mode_choice == 1)
                        while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 3)
                            ratio = input('\nInput the new ''height/outer radius'' (h/a) ratio (0.1 <= ratio <= 3) \nor ''0'' if you do not want to specify it: ');
                        end
                    else
                        while isempty(ratio)||(isnumeric(ratio) == 0)||(ratio < 0.1 && ratio ~= 0)||(ratio > 1.3)
                            ratio = input('\nInput the new ''height/outer radius'' (h/a) ratio (0.1 <= ratio <= 1.3) \nor ''0'' if you do not want to specify it: ');
                        end
                    end
                    if(ratio == 0)
                        define_ratio_span = 1;
                    end
                case 2
                    ratio2 = [];
                    while isempty(ratio2)||(isnumeric(ratio2) == 0)||(ratio2 < 0)||(ratio2 > 0.75)
                        ratio2 = input('\nInput the new ''inner radius/outer radius'' (b/a) ratio (0 < ratio <= 0.75) \nor ''0'' if you do not want to specify it: ');
                    end
                    if(ratio2 == 0)
                        define_ratio2_span = 1;
                    end
                case 3
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nInput the new dielectric constant of the resonator: ');
                    end
                case 4
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nInput the new minimum fractional bandwidth (e.g.: 0.05 for 5%): ');
                    end
                case 5
                    mode_choice = [];
                    while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2)
                        mode_choice = input(['\nFor which mode?\n',...
                                            '   (1) TE01d mode\n', ...
                                            '   (2) TM01d mode\n', ...
                                            'Make your choice: ']);
                    end
                case 6    
                    return
            end  
        else
            repeat = 0;
        end    
    end
    
    if (repeat == 0)
        
        % Header:
        clc
        disp(strvcat('===============================================================',...
                     '       Dielectric resonator design and analysis utility        ',...
                     '==============================================================='));
        disp(sprintf('\n------------------- Ring resonator design ---------------------\n'));

        % Display the input parameters:
        disp(sprintf('Resonant frequency (GHz) = %5.4f',freq));
    
        if (mode_choice == 1)
            disp(sprintf('Mode = TE01d'));
        else  
            disp(sprintf('Mode = TM01d'));
        end
    
        disp(sprintf('Minimum fractional impedance bandwidth = %5.4f',BW));
        disp(sprintf('VSWR for the bandwidth calculations = %5.4f',VSWR));
        disp(sprintf('Dielectric constant of the resonator = %5.4f',er));
    
        % Display the results:
        if (ratio ~= 0 && ratio2 ~= 0)
            disp(sprintf('''Height/outer radius'' (h/a) ratio = %5.4f',ratio));
            disp(sprintf('''Inner radius/outer radius'' (b/a) ratio = %5.4f',ratio2));  

            disp(sprintf('\n'));
            disp(strvcat('        Results for the selected mode       ', ...
                         '--------------------------------------------'));
            disp(sprintf('Inner radius (b) of the resonator (cm) = %5.4f',b));
            disp(sprintf('Outer radius (a) of the resonator (cm) = %5.4f',a));
            disp(sprintf('Height (h) of the resonator (cm) = %5.4f',h));
            disp(sprintf('Q-factor = %5.4f',Qfactor));
            disp(sprintf('Bandwidth (percentage) = %5.4f',actualBW));
        elseif (ratio ~= 0 && ratio2 == 0)
            disp(sprintf('''Height/outer radius'' (h/a) ratio = %5.4f',ratio));
            disp(sprintf('Minimum ''inner radius/outer radius'' (b/a) ratio = %5.4f',ratio2_min));
            disp(sprintf('Maximum ''inner radius/outer radius'' (b/a) ratio = %5.4f',ratio2_max));
            disp(sprintf('Number of ratios to study = %5.5f',number));

            disp(sprintf('\n'));
            disp(strvcat('                  Results for the selected mode                     ', ...                   
                         '===================================================================='));
            disp('b/a         a           b           h           Q-factor    BW');   
            disp('--------------------------------------------------------------------');
            for n = 1:1:size(results,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',results(n,:)));
            end
        elseif (ratio == 0 && ratio2 ~= 0)
            disp(sprintf('''Innner radius/outer radius'' (b/a) ratio = %5.4f',ratio2));
            disp(sprintf('Minimum ''height/outer radius'' (h/a) ratio = %5.4f',ratio_min));
            disp(sprintf('Maximum ''height/outer radius'' (h/a) ratio = %5.4f',ratio_max));
            disp(sprintf('Number of ratios to study = %5.4f',number));

            disp(sprintf('\n'));
            disp(strvcat('                  Results for the selected mode                     ', ...     
                         '===================================================================='));
            disp('h/a         a           b           h           Q-factor    BW');
            disp('--------------------------------------------------------------------');
            for n = 1:1:size(results,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',results(n,:)));
            end
        else
            disp(sprintf('Minimum ''height/outer radius'' (h/a) ratio = %5.4f',ratio_min));
            disp(sprintf('Maximum ''height/outer radius'' (h/a) ratio = %5.4f',ratio_max));
            disp(sprintf('Number of ratios to study = %5.4f',number));
            disp(sprintf('\n'));
            disp(sprintf('Minimum ''inner radius/outer radius'' (b/a) ratio = %5.4f',ratio2_min));
            disp(sprintf('Maximum ''inner radius/outer radius'' (b/a) ratio = %5.4f',ratio2_max));
            disp(sprintf('Number of ratios to study = %5.4f',number2));

            disp(sprintf('\n'));
            disp(strvcat('                         Results for the selected mode                          ', ...                              
                         '================================================================================'));
            disp('h/a         b/a         a           b           h           Q-factor    BW');
            disp('--------------------------------------------------------------------------------');
            for n = 1:1:size(results,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',results(n,:)));
            end    
        end
    end
end

end