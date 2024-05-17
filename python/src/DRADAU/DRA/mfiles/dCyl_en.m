%--------------------------------------------------------------------------
%                                dCyl_en.m                                   
%--------------------------------------------------------------------------
%  Cylindrical dielectric resonator design (english)                                              
%
%    A) INPUTS
%
%    1. 'freq' = Desired resonant frequency                        
%    2. 'mode_choice' = Desired mode of radiation             
%    3. 'BW' = Desired minimum impedance bandwidth         
%    4. 'VSWR' = Tolerable Voltage standing wave ratio for the calculations    
%    5. 'er' = Dielectric constant of the available material
%    6. 'ratio' = 'radius/height' ratio of the resonator (facultative)
%
%    B) OUTPUTS
%
%    - The dimensions (radius and height) of the resonator for which the 
%      minimal bandwidth is respected at the resonant frequency. If a 
%      'radius/height' ratio is not specified by the user, a list of all 
%      the possible dimensions respecting the design criterions will be 
%      generated (over a user-defined span of ratios).
%--------------------------------------------------------------------------
%  References :
%
%  - R.K. Mongia and P. Barthia, "Dielectric resonator antennas - A review
%    and general design relations for resonant frequency and bandwidth,"
%    International journal of microwave and millimeter-wave computer-
%    aided engineering, Vol. 4, No. 3, 1994, pp. 230-247.
%  - A.A. Kishk, A.W. Glisson, and G.P. Junker, "Study of broadband
%    dielectric resonator antennas," 1999 Antenna applications symposium,
%    September 1999, Allerton Park, Monticello, Il, pp. 45-68. 
%--------------------------------------------------------------------------
%  Note: This file is a part of the "Dielectric resonator design and 
%        analysis utility" (DRA.m).
%
%  Programming: Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation: Institut national de la recherche scientifique (INRS)  
%  Last modification: July 31st, 2008                                                    
%--------------------------------------------------------------------------

function dCyl_en

% Header:
clc
disp(strvcat('===============================================================',...
             '       Dielectric resonator design and analysis utility        ',...
             '==============================================================='));
disp(sprintf('\n--------------- Cylindrical resonator design ------------------'));

% Input of the design parameters:
freq = [];
while isempty(freq)||(isnumeric(freq) == 0)
   freq = input('\nInput the desired resonant frequency (GHz): ');
end

mode_choice = [];
while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2 && mode_choice ~= 3 && mode_choice ~= 4)
    mode_choice = input(['\nFor which mode?\n',...
                        '   (1) TE01d mode\n', ...
                        '   (2) HE11d mode\n', ...
                        '   (3) EH11d mode\n', ...
                        '   (4) TM01d mode\n', ...
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
while isempty(ratio)||(isnumeric(ratio) == 0)
    ratio = input('\nInput the desired ''radius/height'' (a/h) ratio\nor ''0'' if you do not want to specify it: ');
end

repeat = 1;
define_ratio_span = 1;
while (repeat == 1)
    
    % Maximum Q-factor for the minimum bandwidth and VSWR:
    maxQfactor = (VSWR-1)/(sqrt(VSWR)*BW);
    Qfactor = [];

    % If a 'radius/height' ratio is specified, we must verify that the
    % minimum bandwidth can be achieved for the desired mode:
    if (ratio ~= 0)
        switch mode_choice 
            case 1
                Qfactor = 0.078192*er^1.27*(1+17.31*(1/ratio)-21.57*(1/ratio)^2+10.86*(1/ratio)^3-1.98*(1/ratio)^4);
            case 2
                Qfactor = 0.01007*er^1.3*(ratio)*(1+100*exp(-2.05*(0.5*ratio-1/80*(ratio)^2)));
            case 3
                Qfactor = er^2*(0.068-0.0388*ratio/2+0.0064*(ratio/2)^2+0.0007*exp(ratio/2*(37.59-63.8*ratio/2)));
            case 4
                Qfactor = 0.008721*er^0.888413*exp(0.0397475*er)*(1-(0.3-0.2*ratio)*((38-er)/28))*...
                          (9.498186*ratio+2058.33*(ratio)^4.322261*exp(-3.50099*(ratio)));
        end
    
        % If it is not possible, the user must change some parameters:
        if (maxQfactor < Qfactor)
            choice = [];
            while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3 && choice ~= 4 && choice ~= 5)
                choice = input(['\nThe desired bandwidth cannot be achieved for this mode with the\n',...
                               'current ''ratio/dielectric constant'' combination. Do you wish to:\n', ...
                               '   (1) Modify the ratio (or omit specifying one)?\n', ...
                               '   (2) Modify the dielectric constant of the resonator?\n', ...
                               '   (3) Modify the minimum impedance bandwidth?\n', ...
                               '   (4) Select another radiation mode?\n', ...
                               '   (5) Return to the main menu?\n', ...                               
                               'Make your choice: ']);
            end   
        
            switch choice 
                case 1
                    ratio = [];
                    while isempty(ratio)||(isnumeric(ratio) == 0)
                        ratio = input('\nInput the new ''radius/height'' (a/h) ratio\nor ''0'' if you do not want to specify it: ');
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
                    while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2 && mode_choice ~= 3 && mode_choice ~= 4)
                        mode_choice = input(['\nFor which mode?\n',...
                                            '   (1) TE01d mode\n', ...
                                            '   (2) HE11d mode\n', ...
                                            '   (3) EH11d mode\n', ...
                                            '   (4) TM01d mode\n', ...
                                            'Make your choice: ']);
                    end
                case 5     
                    return
            end    
        
        % If all parameters are correct, the dimensions of the resonator are calculated:
        else
            switch mode_choice
                case 1
                    h = 4.7713*((2.327/sqrt(er+1))*(1+0.2123*(ratio)-0.00898*(ratio)^2))/(freq*ratio);
                case 2
                    h = 4.7713*((6.324/sqrt(er+2))*(0.27+0.36*0.5*ratio+0.02*(0.5*ratio)^2))/(freq*ratio);
                case 3
                    h = 4.7713*((3.72+0.4464*ratio/2+0.2232*(ratio/2)^2+0.0521*(ratio/2)^3-2.65*...
                        exp(-1.25*ratio/2*(1+4.7*ratio/2)))/sqrt(er))/(freq*ratio);
                case 4
                    h = 4.7713*(sqrt(3.83^2+((pi/2)*ratio)^2)/sqrt(er+2))/(freq*ratio);
            end
            a = ratio*h;
            actualBW = (VSWR-1)/(sqrt(VSWR)*Qfactor)*100;
            repeat = 0;    
        end
             
    else
        if(define_ratio_span == 1)
        
            ratio_min = [];
            while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min == 0)
                ratio_min = input('\nInput the minimum ratio to study (a ratio >= 0.5 is recommended) : ');
            end
        
            ratio_max = [];
            while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)
                ratio_max = input('\nInput the maximum ratio to study (a ratio <= 5 is recommended) : ');
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
        
        for n = ratio_min:step:ratio_max
            
            % For each value of n (of ratio), the Q-factor is calculated:
            switch mode_choice
                case 1
                    Qfactor = 0.078192*er^1.27*(1+17.31*(1/n)-21.57*(1/n)^2+10.86*(1/n)^3-1.98*(1/n)^4);
                case 2
                    Qfactor = 0.01007*er^1.3*(n)*(1+100*exp(-2.05*(0.5*n-1/80*(n)^2)));
                case 3
                    Qfactor = er^2*(0.068-0.0388*n/2+0.0064*(n/2)^2+0.0007*exp(n/2*(37.59-63.8*n/2)));
                case 4
                    Qfactor = 0.008721*er^0.888413*exp(0.0397475*er)*(1-(0.3-0.2*n)*((38-er)/28))*...
                              (9.498186*n+2058.33*(n)^4.322261*exp(-3.50099*(n)));
            end
            
            % If the calculated Q-factor meets the minimum specifications, the dimensions
            % of the resonator and actual bandwidth are calculated and stored:
            if (maxQfactor > Qfactor)
                switch mode_choice
                    case 1
                        h = 4.7713*((2.327/sqrt(er+1))*(1+0.2123*(n)-0.00898*(n)^2))/(freq*n);
                    case 2 
                        h = 4.7713*((6.324/sqrt(er+2))*(0.27+0.36*0.5*n+0.02*(0.5*n)^2))/(freq*n);
                    case 3
                        h = 4.7713*((3.72+0.4464*n/2+0.2232*(n/2)^2+0.0521*(n/2)^3-2.65*...
                            exp(-1.25*n/2*(1+4.7*n/2)))/sqrt(er))/(freq*n);
                    case 4
                        h = 4.7713*(sqrt(3.83^2+((pi/2)*n)^2)/sqrt(er+2))/(freq*n);
                end
                a = n*h;
                actualBW = (VSWR-1)/(sqrt(VSWR)*Qfactor)*100;
                results(row,:) = [n a h Qfactor actualBW]; 
                row = row+1;
            end    
        end
        
        % If the minimum bandwidth cannot be achieved for any value of 'n'
        % (ratio), the user must change at least one design parameter:
        if(row == 1)
            choice = [];
            while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3 && choice ~= 4 && choice ~= 5)
                choice = input(['\nThe desired bandwidth cannot be achieved for this mode with the\n',...
                               'current ''dielectric constant/ratio limits'' combination. Do you wish to:\n', ...
                               '   (1) Modify the ratio limits (or specify a single ratio)?\n', ...
                               '   (2) Modify the dielectric constant of the resonator?\n', ...
                               '   (3) Modify the minimum impedance bandwidth?\n', ...
                               '   (4) Select another radiation mode?\n', ...
                               '   (5) Return to the main menu?\n', ...
                               'Make your choice: ']);
            end
            
            switch choice
                case 1
                    ratio = [];
                    while isempty(ratio)||(isnumeric(ratio) == 0)
                        ratio = input('\nInput the new ''radius/height'' (a/h) ratio\nor ''0'' if you do not want to specify it: ');
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
                    while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2 && mode_choice ~= 3 && mode_choice ~= 4)
                        mode_choice = input(['\nFor which mode?\n',...
                                            '   (1) TE01d mode\n', ...
                                            '   (2) HE11d mode\n', ...
                                            '   (3) EH11d mode\n', ...
                                            '   (4) TM01d mode\n', ...
                                            'Make your choice: ']);
                    end
                case 5    
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
        disp(sprintf('\n--------------- Cylindrical resonator design ------------------\n'));
        
        % Display the input parameters:
        disp(sprintf('Resonant frequency (GHz) = %5.4f',freq));
    
        switch mode_choice
            case 1
                disp(sprintf('Mode = TE01d'));
            case 2
                disp(sprintf('Mode = HE11d'));
            case 3
                disp(sprintf('Mode = EH11d'));
            case 4
                disp(sprintf('Mode = TM01d'));
        end
    
        disp(sprintf('Minimum fractional impedance bandwidth = %5.4f',BW));
        disp(sprintf('VSWR for the bandwidth calculations = %5.4f',VSWR));
        disp(sprintf('Dielectric constant of the resonator = %5.4f',er));
    
        if (ratio ~= 0)
            disp(sprintf('''Radius/height'' (a/h) ratio = %5.4f',ratio));
            
            % Display the results (when the ratio is specified by the user):
            disp(sprintf('\n'));
            disp(strvcat('       Results for the selected mode        ', ...
                         '--------------------------------------------'));
            disp(sprintf('Radius (a) of the resonator (cm) = %5.4f',a));
            disp(sprintf('Height (h) of the resonator (cm) = %5.4f',h));
            disp(sprintf('Q-factor = %5.4f',Qfactor));
            disp(sprintf('Bandwidth (percentage) = %5.4f',actualBW));
      
        else
            % Display the results (when the ratio is not specified):
            disp(sprintf('Minimum ''radius/height'' (a/h) ratio = %5.4f',ratio_min));
            disp(sprintf('Maximum ''radius/height'' (a/h) ratio = %5.4f',ratio_max));
            disp(sprintf('Number of ratios to study = %5.4f',number));
            disp(sprintf('\n'));
            disp(strvcat('             Results for the selected mode              ', ...  
                         '--------------------------------------------------------'));
            disp('a/h         a           h           Q-factor    BW');
            disp('--------------------------------------------------------');
            for n = 1:1:size(results,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',results(n,:)));
            end         
        end
    end
end

end