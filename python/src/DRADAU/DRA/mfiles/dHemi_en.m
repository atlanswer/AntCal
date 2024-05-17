%--------------------------------------------------------------------------
%                                dHemi_en.m                                   
%--------------------------------------------------------------------------
%  Hemispherical dielectric resonator design (english)                                              
%
%    A) INPUTS
%
%    1. 'freq' = Desired resonant frequency                        
%    2. 'mode_choice' = Desired mode of radiation             
%    5. 'er' = Dielectric constant of the available material (facultative)
%    3. 'BW' = Desired minimum impedance bandwidth         
%    4. 'VSWR' = Tolerable Voltage standing wave ratio for the calculations    
%
%    B) OUTPUTS
%
%    - Radius of the resonator, Q-factor, impedance bandwidth, and 
%      dielectric constant (if not specified).
%--------------------------------------------------------------------------
%  Reference:
%
%  - M. Gastine, L. Courtois, and J.J. Dormann, "Electromagnetic resonances
%    of free dielectric spheres," IEEE Transactions on microwave theory
%    and techniques, Vol. 15, No. 12, December 1967, pp. 694-700.
%--------------------------------------------------------------------------
%  Note: This file is a part of the "Dielectric resonator design and 
%        analysis utility" (DRA.m). The equations are taken from the book 
%        "Dielectric resonator antenna handbook" by Also Petosa.
%
%  Programming: Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation: Institut national de la recherche scientifique (INRS)  
%  Last modification: July 31st, 2008                              
%--------------------------------------------------------------------------

function dHemi_en

% Header:
clc
disp(strvcat('===============================================================',...
             '       Dielectric resonator design and analysis utility        ',...
             '==============================================================='));
disp(sprintf('\n--------------- Hemispherical resonator design ----------------'));

% Input of the design parameters:
freq = [];
while isempty(freq)||(isnumeric(freq) == 0)
   freq = input('\nInput the desired resonant frequency (GHz): ');
end

mode_choice = [];
while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2)
    mode_choice = input(['\nFor which mode?\n',...
                        '   (1) TE111 mode (maximum at broadside)\n', ...
                        '   (2) TM101 mode (null at broadside)\n', ...
                        'Make your choice: ']);
end

er = [];
while isempty(er)||(isnumeric(er) == 0),
   er = input('\nInput the dielectric constant of the resonator\nor ''0'' if you do not want to specify it: ');
end

BW = [];
if (er ~= 0)
    while isempty(BW)||(isnumeric(BW) == 0)
        BW = input('\nInput the minimum fractional bandwidth (e.g.: 0.05 for 5%): ');
    end
else
    while isempty(BW)||(isnumeric(BW) == 0)
        BW = input('\nInput the desired fractional bandwidth (e.g.: 0.05 for 5%): ');
    end
end    

VSWR = [];
while isempty(VSWR)||(isnumeric(VSWR) == 0)
    VSWR = input('\nInput the VSWR for the impedance bandwidth calculations (e.g.: 2): ');
end

repeat = 1;

while (repeat == 1)
    
    % Q-factor calculations from the specified impedance bandwidth:
    maxQfactor = (VSWR-1)/(sqrt(VSWR)*BW);
    Qfactor = [];

    % If a dielectric constant is specified, we must verify that the
    % minimum bandwidth can be achieved for the desired mode:
    if(er ~= 0)
        switch mode_choice
            case 1
                Qfactor = 0.08+0.796*er+0.01226*er^2-3e-5*er^3;
                ka = 2.8316*er^-0.47829;
            case 2
                if (er <= 20)
                    Qfactor = 0.723+0.9324*er-0.0956*er^2+0.00403*er^3-5e-5*er^4;
                else
                    Qfactor = 2.621-0.574*er+0.02812*er^2+2.59e-4*er^3;
                end
                ka = 4.47226*er^-0.505;
        end
        
        % If it is not possible, the user must change some parameters:
        if (maxQfactor < Qfactor)
            choice = [];
            while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3 && choice ~= 4)
                choice = input(['\nThe desired bandwidth cannot be achieved for this mode with the\n',...
                               'current dielectric constant. Do you wish to:\n', ...
                               '   (1) Modify the dielectric constant of the resonator?\n', ...
                               '   (2) Modify the minimum bandwidth?\n', ...
                               '   (3) Select another mode?\n', ...
                               '   (4) Return to the main menu?\n', ...
                               'Make your choice: ']);
            end
            
            switch choice
                case 1
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nInput the new dielectric constant of the resonator\nor ''0'' if you do not want to specify it: ');
                    end
                case 2
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nInput the new minimum fractional bandwidth (e.g.: 0.05 for 5%): ');
                    end
                case 3
                    mode_choice = [];
                    while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2)
                        mode_choice = input(['\nFor which mode?\n',...
                                            '   (1) TE111 mode (maximum at broadside)\n', ...
                                            '   (2) TM101 mode (null at broadside)\n', ...
                                            'Make your choice: ']);
                    end
                case 4    
                    return
            end
        else
            repeat = 0;
        end    
    else
        switch mode_choice
        case 1
            er_calc = fsolve(@(x)0.08+0.796*x+0.01226*x^2-3e-5*x^3-maxQfactor,50);
            ka = 2.8316*er_calc^-0.47829;
        case 2
            if (maxQfactor <= 5.371)
                er_calc = fsolve(@(x)0.723+0.9324*x-0.0956*x^2+0.00403*x^3-5e-5*x^4-maxQfactor,10);
            else
                er_calc = fsolve(@(x)2.621-0.574*x+0.02812*x^2+2.59e-4*x^3-maxQfactor,60);
            end
            ka = 4.47226*er_calc^-0.505;
        end
        
        % An error message is displayed if the calculated dielectric constant is less than 1
        if (er_calc < 1)
            choice = [];
            while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3 && choice ~= 4)
                choice = input(['\nThe desired bandwidth cannot be achieved for this mode because the required\n',...
                               'dielectric constant would be physically unfeasible (er < 1). Do you wish to:\n', ...
                               '   (1) Specify a dielectric constant?\n', ...
                               '   (2) Modify the desired impedance bandwidth?\n', ...
                               '   (3) Select another mode?\n', ...
                               '   (4) Return to the main menu?\n', ...
                               'Make your choice: ']);
            end
            
            switch choice
                case 1
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nInput the dielectric constant of the resonator: ');
                    end
                case 2
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nInput the new desired fractional bandwidth (e.g.: 0.05 for 5%): ');
                    end
                case 3
                    mode_choice = [];
                    while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2)
                        mode_choice = input(['\nFor which mode?\n',...
                                            '   (1) TE111 mode (maximum at broadside)\n', ...
                                            '   (2) TM101 mode (null at broadside)\n', ...
                                            'Make your choice: ']);
                    end
                case 4    
                    return
            end
        else
            repeat = 0;
        end    
    end
    
    if (repeat == 0)
        
        % When all the parameters are correct, the radius is calculated:
        a = 4.7713*ka/freq;
        
        % Bandwidth calculation (if a dielectric constant is specified):
        if (er ~= 0)
            actualBW = (VSWR-1)/(sqrt(VSWR)*Qfactor)*100;
        end    
          
        % Header:
        clc
        disp(strvcat('===============================================================',...
                     '       Dielectric resonator design and analysis utility        ',...
                     '==============================================================='));
        disp(sprintf('\n--------------- Hemispherical resonator design ----------------\n'));

        % Diplay the input parameters:
        disp(sprintf('Resonant frequency (GHz) = %5.4f',freq));
    
        if (mode_choice == 1)
            disp(sprintf('Mode = TE111'));
        else
            disp(sprintf('Mode = TM101'));
        end

        if (er ~= 0)
            disp(sprintf('Minimum fractional impedance bandwidth = %5.4f',BW));
        else
            disp(sprintf('Fractional impedance bandwidth = %5.4f',BW));
        end
        
        disp(sprintf('VSWR for the bandwidth calculations = %5.4f',VSWR));
        
        if (er ~= 0)
            disp(sprintf('Dielectric constant of the resonator = %5.4f',er));
        end
        
        % Display the results:
        disp(sprintf('\n'));
        disp(strvcat('       Results for the selected mode        ', ...
                     '--------------------------------------------'));
        disp(sprintf('    Radius (a) of the resonator (cm) = %5.4f',a));
        if (er == 0)
            disp(sprintf('Dielectric constant of the resonator = %5.4f',er_calc));
            disp(sprintf('                            Q-factor = %5.4f',maxQfactor));
        else
            disp(sprintf('                            Q-factor = %5.4f',Qfactor));
            disp(sprintf('    Impedance bandwidth (percentage) = %5.4f',actualBW));
        end
    end
end

end