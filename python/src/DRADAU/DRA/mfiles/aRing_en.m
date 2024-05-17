%--------------------------------------------------------------------------
%                               aRing_en.m                                   
%--------------------------------------------------------------------------
%  Dielectric ring resonator analysis (english)                                              
%
%    A) INPUTS
%
%    1. 'a' = Outer radius of the resonator (cm)
%    2. 'b' = Inner radius of the resonator (cm)
%    3. 'h' = Height of the resonator (cm)                          
%    4. 'er' = Dielectric constant of the resonator
%    5. 'VSWR' = Tolerable voltage standing wave ratio for the calculation
%       of the impedance bandwidth
%
%    B) OUTPUTS
%
%    - The resonant frequency, Q-factor, and impedance bandwidth of the       
%      TE01d et TM01d modes.
%--------------------------------------------------------------------------
%  References:
%
%  - M. Verplanken and J. Van Bladel, "The electric dipole resonances of
%    ring resonators of very high permittivity," IEEE Transactions on 
%    microwave theory and techniques, Vol. 24, No. 2, February 1976, pp. 
%    108-112.
%  - M. Verplanken and J. Van Bladel, "The magnetic dipole resonances of
%    ring resonators of very high permittivity," IEEE Transactions on 
%    microwave theory and techniques, Vol. 27, No. 4, April 1979, pp.
%    328-332.
%--------------------------------------------------------------------------
%  Note: This file is a part of the "Dielectric resonator design and 
%        analysis utility" (DRA.m).
%
%  Programming: Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation: Institut national de la recherche scientifique (INRS)  
%  Last modification: July 31st, 2008                                                    
%--------------------------------------------------------------------------

function aRing_en

% Header:
clc
disp(strvcat('===============================================================',...
             '       Dielectric resonator design and analysis utility        ',...
             '==============================================================='));
disp(sprintf('\n------------------ Ring resonator analysis --------------------'));

repeat = 1;
while repeat == 1
    repeat = 0;
    
    % Input of the parameters:
    a = [];
    while isempty(a)||(isnumeric(a) == 0),
        a = input('\nInput the outer radius (a) of the resonator (cm): ');
    end

    b = [];
    while isempty(b)||(isnumeric(b) == 0)||(b >= a),
        b = input('\nInput the inner radius (b) of the resonator (cm): ');
    end

    h = [];
    while isempty(h)||(isnumeric(h) == 0),
        h = input('\nHeight (h) of the resonator (cm): ');
    end

    er = [];
    while isempty(er)||(isnumeric(er) == 0),
        er = input('\nInput the dielectric constant (er) of the resonator: ');
    end
    
    VSWR = [];
    while isempty(VSWR)||(isnumeric(VSWR) == 0),
        VSWR = input('\nInput the VSWR for the impedance bandwidth calculation (e.g.: 2): ');
    end
    
    % A warning is issued if certain boudaries are exceeded: 
    if (b/a > 0.75)||(h/a > 1.3)
        choice = [];
        while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3)
            choice = input(['\nWarning! The ''inner radius/outer radius'' ratio (b/a) exceeds 0.75 and/or\n',...
                             'the ''height/outer radius'' (h/a) ratio exceeds 1.3. The results of the approximations\n',...
                             'may be erroneous, especially for the TE01d mode! Do you wish to:\n', ...
                             '   (1) Proceed with the calculations anyway?\n', ...
                             '   (2) Input new parameter values?\n', ...
                             '   (3) Return to the main menu?\n', ...
                             'Make your choice: ']);
        end
        switch choice
            case 1
                break
            case 2
                repeat = 1;
            case 3
                return
        end
    % A warning is issued if the dielectric constant is less than 20:
    elseif (er < 20 && repeat == 0)
        choice = [];
        while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3)
            choice = input(['\nWarning! The approximations used by the application are valid for a relatively\n',...
                             'high dielectric constant (er > 20). The results may be erroneous! Do you wish to:\n', ...
                             '   (1) Proceed with the calculations anyway?\n', ...
                             '   (2) Input new parameter values?\n', ...
                             '   (3) Return to the main menu?\n', ...
                             'Make your choice: ']);
        end
        switch choice
            case 1
                break
            case 2
                repeat = 1;
            case 3
                return
        end     
    end        
end

%=================================%
% Calculations for the TE01d mode %
%=================================%

% Resonant frequency (GHz):
freq_TE = 4.7713*polyval(coeffTE(b/a),h/a)/sqrt(er)/a;
% Q-factor:
Qfactor_TE = polyval(coeffQTE(b/a),h/a)*er^1.5;
% Bandwidth:
BW_TE = (VSWR-1)/(sqrt(VSWR)*Qfactor_TE)*100;

%=================================%
% Calculations for the TM01d mode %
%=================================%

% Resonant frequency (GHz):
freq_TM = 4.7713/sqrt(er)*sqrt((pi/2/h)^2+(calcX0(b/a)/a)^2);
% Q-factor:
Qfactor_TM = polyval(coeffQTM(b/a),h/a)*er^2.5;
% Bandwidth:
BW_TM = (VSWR-1)/(sqrt(VSWR)*Qfactor_TM)*100;

% Header:
clc
disp(strvcat('===============================================================',...
             '       Dielectric resonator design and analysis utility        ',...
             '==============================================================='));
disp(sprintf('\n------------------ Ring resonator analysis --------------------\n'));

% Display the input parameters:
disp(sprintf('Outer radius (a) of the resonator (cm) = %5.4f',a));
disp(sprintf('Inner radius (b) of the resonator (cm) = %5.4f',b));
disp(sprintf('Height (h) of the resonator (cm) = %5.4f',h));
disp(sprintf('Dielectric constant of the resonator = %5.4f',er));

% Display the results:
disp(sprintf('\n'));
disp(strvcat('                   TE01d mode                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Resonant frequency (GHz) = %5.4f',freq_TE));
disp(sprintf('                    Q-factor = %5.4f',Qfactor_TE));
disp(sprintf('      Bandwidth (percentage) = %5.4f',BW_TE));

disp(sprintf('\n'));
disp(strvcat('                   TM01d mode                    ', ...
             '-------------------------------------------------'));
disp(sprintf('    Resonant frequency (GHz) = %5.4f',freq_TM));
disp(sprintf('                    Q-factor = %5.4f',Qfactor_TM));
disp(sprintf('      Bandwidth (percentage) = %5.4f',BW_TM));

end